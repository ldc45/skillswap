/*
  Warnings:

  - A unique constraint covering the columns `[user_id,day,start_time,end_time]` on the table `availability` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "availability_user_id_day_start_time_end_time_key" ON "availability"("user_id", "day", "start_time", "end_time");
