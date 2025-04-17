declare module 'localtunnel' {
  interface TunnelOptions {
    port: number;
    subdomain?: string;
    host?: string;
    local_host?: string;
    local_https?: boolean;
    local_cert?: string;
    local_key?: string;
    local_ca?: string;
    allow_invalid_cert?: boolean;
  }

  interface Tunnel {
    url: string;
    tunnel_cluster?: string;
    on(event: 'close', listener: () => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'request', listener: (info: { path: string }) => void): this;
    close(): void;
  }

  export default function localtunnel(options: TunnelOptions): Promise<Tunnel>;
}