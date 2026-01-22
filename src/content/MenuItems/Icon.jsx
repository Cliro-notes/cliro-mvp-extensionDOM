import { icons } from "./constants";

export const Icon = ({ type }) => (
    <div style={{ width: 14, opacity: 0.7 }}>{icons[type]}</div>
);