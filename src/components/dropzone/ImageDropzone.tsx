"use client";

import { useCallback } from "react";
import { type DropzoneOptions, useDropzone } from "react-dropzone";

import { trpc } from "~/lib/trpc/client";
import { cn } from "~/lib/utils";

type ChildrenRenderProps = {
  isLoading: boolean;
};

type Props = {
  className?: string;

  children: React.ReactNode | ((props: ChildrenRenderProps) => React.ReactNode);
};

export function ImageDropzone({ children, className }: Props) {
  // bring over the hooks

  const utils = trpc.useContext();

  const uploadDocumentMutation = trpc.awardRouter.uploadImageToS3.useMutation();

  const onDropRaw: DropzoneOptions["onDrop"] = (acceptedFiles, _, e) => {
    const file = acceptedFiles[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {
      const result = reader.result;

      if (typeof result !== "string") return;

      const base64String = result.split(",")[1];

      if (!base64String) return;

      await uploadDocumentMutation.mutateAsync({
        filename: file.name,
        fileDataBase64: base64String,
        fileMimeType: file.type,
      });

      // invalidate everything for now
      await utils.invalidate();
    };

    reader.readAsDataURL(file);
  };

  const onDrop = useCallback(onDropRaw, [uploadDocumentMutation, utils]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noDragEventsBubbling: true,
  });

  return (
    <div className={cn({ "ring-primary ring-2": isDragActive }, className)}>
      <div {...getRootProps()}>
        <input {...getInputProps()} />

        {typeof children === "function"
          ? children({ isLoading: uploadDocumentMutation.isLoading })
          : children}
      </div>
    </div>
  );
}
