/// <reference types="@webgpu/types" />

export async function initWebGPU() {
    if (!("gpu" in navigator)) return;

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) { return; }
    const device = await adapter.requestDevice();
}