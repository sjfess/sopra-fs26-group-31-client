"use client";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { Button, Form, Input , Select} from "antd";
import React, { useState } from "react";




const GameHub: React.FC = () => {
    const [gameEra, setGameEra] = useState("");
    const [gameDifficulty, setGameDifficulty] = useState("");
    const [lobbyCode, setLobbyCode] = useState("");
    const apiService = useApi();
    const router = useRouter();

    const handleCreateGame = async() =>{
        try{
            const response = await apiService.post<{id: number}>("/games?era=" + gameEra, null);
            router.push("/lobby/" + response.id);
        }catch(error){
            if (error instanceof Error) {
                alert(`Something went wrong during the creation of the game:\n${error.message}`);
            } else {
                console.error("An unknown error occurred during login.");
            }
        }
    }


    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>


            <div style={{ backgroundColor: "#0d1b4b", border: "1px solid #e3cb2c", borderRadius: "16px", padding: "100px" }}>
                <h2 style={{ color: "#e3cb2c", textAlign: "center" }}>Create Game</h2>

                <Form layout="vertical">
                    <Form.Item label={"Era"}>
                        <Select
                        placeholder={"Select Era"}
                        onChange={ (val) => setGameEra(val)}
                        options={[
                            { value: "Medieval", label: "Medieval" },
                            { value: "Renaissance", label: "Renaissance" },
                            { value: "Modern", label: "Modern"},
                            { value: "Imperial Rome", label: "Imperial Rome"}
                        ]}>
                        </Select>
                    </Form.Item>
                    <Form.Item label={"Game Difficulty"}>
                        <Select
                            placeholder={"Select Game Difficulty"}
                            onChange={ (val) => setGameDifficulty(val)}
                            style={{ width: "100%", color: "#e3cb2c"}}
                            options={[
                                { value: "Easy", label: "Easy" },
                                { value: "Medium", label: "Medium" },
                                { value: "Hard", label: "Hard"},
                            ]}>
                        </Select>
                    </Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        style={{ backgroundColor: "#b56464", color: "#f5ebd5" }}
                        onClick={handleCreateGame}
                    >
                        Create Game
                    </Button>
                </Form>
            </div>
            <div style={{ backgroundColor: "#0d1b4b", border: "1px solid #e3cb2c", borderRadius: "16px", padding: "100px" }}>
                <h2 style={{ color: "#e3cb2c", textAlign: "center" }}>Join Game</h2>

                <Form layout="vertical">
                    <Form.Item
                        label={"Lobby Code"}
                        name = "Lobby Code"

                    >
                        <Input placeholder={"Please input your Lobby Code!"}
                        onChange={(e) => setLobbyCode(e.target.value)}/>
                    </Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        style={{ backgroundColor: "#b56464", color: "#f5ebd5" }}
                    >
                        Join Game
                    </Button>
                </Form>
            </div>
        </div>
    );

}
export default GameHub;
