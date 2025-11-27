export const ik = (path: string = "", transforms: string = "w-1200,q-80,f-auto") => {
    if (!path) return "/placeholder.jpg";
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_IMAGEKIT_URL}${path}?tr=${transforms}`;
};
