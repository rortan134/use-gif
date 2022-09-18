export interface EmbedResponse {
    success: boolean;
    type: string;
    version: string;
    provider_name: string;
    provider_url: string;
    title: string;
    author_name: string;
    author_url: string;
    height: string;
    width: string;
    thumbnail_width: string;
    thumbnail_height: string;
    thumbnail_url: string;
    html: string;
    src: string;
}

export interface IActivePen {
    pen: EmbedResponse;
    url: string;
}
