import { instance } from "./client";

export async function getHabits(){
    const response = await instance.get("/habits/");
    return response.data;
}

export async function createHabit(body){
    const response = await instance.post("/habits/", body);
    return response.data;
}

export async function updateHabit(habit_id, body){
    const response = await instance.put(`/habits/${habit_id}`, body);
    return response.data;
}

export async function deleteHabit(habit_id){
    await instance.delete(`/habits/${habit_id}`);
}

export async function getStreak(habit_id){
    const response = await instance.get(`/habits/${habit_id}/streak`);
    return response.data;
}

export async function getCompletions(habit_id){
    const response = await instance.get(`/habits/${habit_id}/logs`);
    return response.data;
}

export async function addCompletions(habit_id, body){
    const response = await instance.post(`/habits/${habit_id}/logs`, body);
    return response.data;
}

export async function deleteCompletions(habit_id, completion_id){
    await instance.delete(`/habits/${habit_id}/logs/${completion_id}`);
}