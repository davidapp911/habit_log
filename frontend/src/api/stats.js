import { instance } from "./client";

export async function getStreaks(){
    const response = await instance.get("/stats/streaks");
    return response.data;
}

export async function getSummary(days){
    const response = await instance.get("/stats/summary", { params: { days } });
    return response.data;
}