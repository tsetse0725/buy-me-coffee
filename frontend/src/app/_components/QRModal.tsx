"use client";

import { QRCodeSVG } from "qrcode.react";

type Props = {
  url: string;       // төлбөрийн линк /pay/123 …
  onClose: () => void;
};

export default function QRModal({ url, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Card */}
      <div className="relative bg-white rounded-lg p-6 w-full max-w-sm text-center shadow-lg">
        {/* Close (×) */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl text-gray-500 hover:text-black"
        >
          ×
        </button>

        <h2 className="text-lg font-semibold mb-2">Scan QR code</h2>
        <p className="text-sm text-gray-500 mb-4">
          Scan the QR code to complete your donation
        </p>

        {/* QR код */}
        <div className="flex justify-center">
          <QRCodeSVG value={url} size={200} />
        </div>
      </div>
    </div>
  );
}
