import { Client } from "minio";

export async function up(db: Client): Promise<void> {
  async function makeAndDecorate(bucketName: string) {
    await db.makeBucket(bucketName);
    await db.setBucketPolicy(
      bucketName,
      `
      {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Principal": {
              "AWS": ["*"]
            },
            "Action": ["s3:GetBucketLocation", "s3:ListBucket"],
            "Resource": ["arn:aws:s3:::${bucketName}"]
          },
          {
            "Effect": "Allow",
            "Principal": {
              "AWS": ["*"]
            },
            "Action": ["s3:GetObject"],
            "Resource": ["arn:aws:s3:::${bucketName}/*"]
          }
        ]
      }
      `,
    );
  }

  await Promise.all([
    makeAndDecorate("audio"),
    makeAndDecorate("binary"),
    makeAndDecorate("image"),
    makeAndDecorate("video"),
  ]);
}

export async function down(db: Client): Promise<void> {
  async function removeBucket(bucketName: string) {
    const objects = await db.listObjects(bucketName).toArray();
    await db.removeObjects(
      bucketName,
      objects.map((it) => it.name),
    );
    await db.removeBucket(bucketName);
  }

  await Promise.all([
    removeBucket("audio"),
    removeBucket("binary"),
    removeBucket("image"),
    removeBucket("video"),
  ]);
}
