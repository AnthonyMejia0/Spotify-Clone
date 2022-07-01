import { atom } from "recoil";

export const artistIdState = atom({
    key: "artistIdState",
    default: null,
});

export const artistState = atom({
    key: "artistState",
    default: "",
});