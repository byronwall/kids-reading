"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { trpc } from "~/lib/trpc/client";
import { cn } from "~/lib/utils";
import { type RouterInputs } from "~/utils/api";

type ChildrenRenderProps = {
  isLoading: boolean;
};

type Props = {
  className?: string;

  children: React.ReactNode | ((props: ChildrenRenderProps) => React.ReactNode);
};

type ImageResult = RouterInputs["awardRouter"]["uploadImageToS3"];

export function ImageDropzone({ children, className }: Props) {
  // bring over the hooks

  const utils = trpc.useContext();

  const uploadDocumentMutation = trpc.awardRouter.uploadImageToS3.useMutation();

  const [isDragActive, setDragActive] = useState(false);

  const handleDrop = async (e: React.DragEvent<HTMLElement>) => {
    e.stopPropagation();
    e.preventDefault();

    setDragActive(false);

    const dropData = extractDropData(e);

    const imageResult = await extractImageResultFromDropdata(dropData);

    await uploadDocumentMutation.mutateAsync(imageResult);

    // invalidate everything for now
    await utils.invalidate();
  };

  return (
    <div className={cn({ "ring-primary ring-2": isDragActive }, className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={handleDrop}
      >
        {typeof children === "function"
          ? children({ isLoading: uploadDocumentMutation.isLoading })
          : children}
      </div>
    </div>
  );
}

// Function to extract base64 data from a Blob
async function extractBase64WithoutMimeFromBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const fullBase64 = reader.result as string;
      const base64Data = fullBase64.split(",")[1];
      if (!base64Data) {
        reject(new Error("No image data found"));
        return;
      }

      resolve(base64Data);
    };

    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function getImageResultFromUrl(url: string): Promise<ImageResult> {
  const response = await fetch(url);
  const blob = await response.blob();
  const base64Data = await extractBase64WithoutMimeFromBlob(blob);

  // use mime type to guess file extension
  const fileExtGuess = blob.type.split("/")[1];

  // only keep the data part of the base64 string

  return {
    filename: uuidv4() + "." + fileExtGuess,
    fileDataBase64: base64Data,
    fileMimeType: blob.type,
  };
}

type DropData = {
  files: File[];
  text: string | null;
  url: string | null;
  customData: Record<string, string>;
};

function extractDropData(event: React.DragEvent<HTMLElement>): DropData {
  const result: DropData = {
    files: [],
    text: null,
    url: null,
    customData: {},
  };

  // Extract files if present
  if (event.dataTransfer && event.dataTransfer.files.length > 0) {
    for (const file of event.dataTransfer.files) {
      result.files.push(file);
    }
  }

  // Extract text data if present
  const textData = event.dataTransfer?.getData("text/plain") || null;
  if (textData) {
    result.text = textData;
  }

  // Extract URL if present
  const urlData = event.dataTransfer?.getData("text/uri-list") || null;
  if (urlData) {
    result.url = urlData;
  }

  // Extract any custom data based on available types
  for (const type of event.dataTransfer?.types || []) {
    if (type !== "Files" && type !== "text/plain" && type !== "text/uri-list") {
      result.customData[type] = event.dataTransfer?.getData(type) || "";
    }
  }

  return result;
}

async function extractImageResultFromDropdata(
  dropData: DropData
): Promise<ImageResult> {
  if (dropData.files.length > 0) {
    const file = dropData.files[0];

    if (file?.type.startsWith("image/")) {
      return {
        filename: file.name,
        fileDataBase64: await extractBase64WithoutMimeFromBlob(file),
        fileMimeType: file.type,
      };
    }
  } else if (dropData.customData["text/html"]) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(
      dropData.customData["text/html"],
      "text/html"
    );
    const imageUrl = htmlDoc.querySelector("img")?.src;
    if (imageUrl) {
      return await getImageResultFromUrl(imageUrl);
    }
  }

  throw new Error("No image data found");
}
