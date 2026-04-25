import threading
from scapy.all import sniff, IP, TCP, UDP, ICMP
import time
from datetime import datetime

class FlowSniffer:
    def __init__(self, interface=None):
        self.interface = interface
        self.running = False
        self.thread = None
        self.flows = {}
    
    def start(self):
        self.running = True
        self.thread = threading.Thread(target=self._sniff_loop, daemon=True)
        self.thread.start()
        print(f"[*] Sniffer started on interface {self.interface}")

    def stop(self):
        self.running = False
        if self.thread:
            self.thread.join(timeout=2.0)
        print("[*] Sniffer stopped")

    def _packet_callback(self, packet):
        if not self.running:
            return

        if IP in packet:
            ip_layer = packet[IP]
            src_ip = ip_layer.src
            dst_ip = ip_layer.dst
            protocol = ip_layer.proto
            
            src_port, dst_port = 0, 0
            proto_name = "OTHER"

            if TCP in packet:
                src_port = packet[TCP].sport
                dst_port = packet[TCP].dport
                proto_name = "TCP"
            elif UDP in packet:
                src_port = packet[UDP].sport
                dst_port = packet[UDP].dport
                proto_name = "UDP"
            elif ICMP in packet:
                proto_name = "ICMP"

            # Create a basic flow identifier (uni-directional for simplicity first)
            flow_id = f"{src_ip}:{src_port}-{dst_ip}:{dst_port}-{proto_name}"
            
            # Here we will add the 40+ feature extraction logic
            # Simulating basic stats collection:
            if flow_id not in self.flows:
                self.flows[flow_id] = {
                    "src_ip": src_ip,
                    "dst_ip": dst_ip,
                    "src_port": src_port,
                    "dst_port": dst_port,
                    "protocol": proto_name,
                    "start_time": time.time(),
                    "packet_count": 0,
                    "total_bytes": 0,
                }
            
            self.flows[flow_id]["packet_count"] += 1
            self.flows[flow_id]["total_bytes"] += len(packet)

    def _sniff_loop(self):
        # We use a filter to ignore loopback noise unless specifically testing
        # For production on windows, interface selection might need fine-tuning
        try:
            sniff(prn=self._packet_callback, store=False, stop_filter=lambda x: not self.running)
        except Exception as e:
            print(f"[-] Sniffer error: {e}")
            self.running = False

    def get_flows(self):
        # Return a snapshot and optionally clear for the next window
        return list(self.flows.values())

