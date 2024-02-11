-- CreateTable
CREATE TABLE "verifyCodes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "deviceId" TEXT,
    "deviceName" TEXT,
    "token" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "wrongCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verifyCodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verifyCodes_token_key" ON "verifyCodes"("token");

-- AddForeignKey
ALTER TABLE "verifyCodes" ADD CONSTRAINT "verifyCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
