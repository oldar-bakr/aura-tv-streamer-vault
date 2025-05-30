
export interface M3ULink {
  id: string;
  name: string;
  url: string;
  description?: string;
  category?: string;
  logo?: string;
  createdAt?: string;
}

export interface Channel {
  name: string;
  url: string;
  logo?: string;
  group?: string;
}
