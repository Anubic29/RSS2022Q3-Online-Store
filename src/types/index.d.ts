export {};

declare global {
    interface Window {
        route: (event: Event) => void;
    }
}
