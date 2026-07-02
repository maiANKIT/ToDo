import { useEffect, useRef } from "react";

const useFaviconBadge = (active) => {
  const originalHrefRef = useRef(null);

  useEffect(() => {
    const link = document.querySelector("link[rel='icon']");
    if (!link) return;

    if (!originalHrefRef.current) originalHrefRef.current = link.href;

    if (!active) {
      link.href = originalHrefRef.current;
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, 64, 64);

      ctx.beginPath();
      ctx.arc(50, 14, 12, 0, Math.PI * 2);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      link.href = canvas.toDataURL("image/png");
    };
    img.onerror = () => {};
    img.src = originalHrefRef.current;
  }, [active]);
};

export default useFaviconBadge;