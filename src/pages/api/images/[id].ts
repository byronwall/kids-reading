import { type NextApiHandler } from "next";

import { env } from "~/env.mjs";
import { s3 } from "~/server/api/routers/awardRouter";
import { getServerAuthSession } from "~/server/auth";

const handler: NextApiHandler = async (req, res) => {
  // hit the database and return the file

  const { id } = req.query;

  const session = await getServerAuthSession({ req, res });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // load image from S3

  const data = await s3
    .getObject({
      Bucket: env.S3_BUCKET_NAME,
      Key: id as string,
    })
    .promise();

  if (!data) {
    return res.status(404).json({ message: "Not found" });
  }

  // convert blob data to buffer

  // Determine the content type (e.g., 'image/jpeg', 'image/png')
  const contentType = data.ContentType ?? "image/png";
  const doc = data.Body as any;

  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Length", doc.length);

  // include file name
  res.setHeader("Content-Disposition", `attachment; filename=${doc.filename}`);

  res.end(doc);
};

export default handler;
