import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = () => {
    return {
        seo: {
            title: "ARQO | Building Envelope Solutions",
            description:
                "ARQO specializes in premium building envelope systems — facades, cladding, glazing, and insulation for modern architecture.",
            ogImage: "https://arqo.com/og-default.jpg",
            canonical: "https://arqo.com",
        },
    };
};