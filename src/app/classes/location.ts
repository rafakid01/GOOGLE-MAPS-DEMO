export interface OriginLocation {
    numberStreet?: string | number,
    street: string,
    district: string,
    city: string,
    country: string,
    postal_code?: string,
    lat?: number,
    lng?: number
}

export interface DestinationLocation {
    numberStreet?: string | number,
    street: string,
    district: string,
    city: string,
    country: string,
    postal_code?: string,
    lat?: number,
    lng?: number
}