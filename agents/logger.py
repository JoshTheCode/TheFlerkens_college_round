stream_logs = []

def live_log(msg: str):
    print(f"[AGENTBREAK] {msg}")
    stream_logs.append(msg)
    if len(stream_logs) > 200:
        stream_logs.pop(0)

def clear_logs():
    stream_logs.clear()
