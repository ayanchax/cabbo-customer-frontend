import { useContext } from "react";
import { OverlayContext } from "@/context";

export const useOverlay = () => useContext(OverlayContext);