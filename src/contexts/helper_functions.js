export function fillTail(envs) {
    for (let i = envs.length - 2; i >= 0; i--) {
        envs[i].tail = envs[i + 1];
    }
    return envs;
}
