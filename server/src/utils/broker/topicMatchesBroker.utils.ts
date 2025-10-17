function topicMatchesBroker_Utils(pattern: string, topic: string): boolean {
    const patt = pattern.split("/");
    const top = topic.split("/");

    for (let i = 0; i < patt.length; i++) {
        const p = patt[i];
        const t = top[i];

        if (p === "#") return true;
        if (p === "+") {
            if (t === undefined) return false;
            continue;
        }
        if (t !== p) return false;
    }
    return patt.length === top.length;
}

export { topicMatchesBroker_Utils };
