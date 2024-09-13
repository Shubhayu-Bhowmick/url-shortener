import QRCode from 'react-qr-code';

export default function ShortUrlQRCode({ url }) {
  return (
    <div className="bg-gray-100 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 p-1 rounded-lg inline-block border-2 border-black">
       <QRCode value={url} size={32} className='w-10 h-10'/>
    </div>
  );
}