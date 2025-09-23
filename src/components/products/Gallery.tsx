import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);



export function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  return (
    <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
      {images.map((image, i) => (
        <Image
          className={clsx(
            'h-full w-full object-contain transition-all ease-in-out duration-700',
          )}
          key={image.src}
          src={image.src}
          alt={image.altText}
          width={550}
          height={550}
        />
      ))}

      {images.length > 1 ? (
        <div className="absolute bottom-[15%] flex w-full justify-center">
          <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
            <Link
              href={'#'}
              className="h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white"
            >
              <ArrowLeftIcon className="h-5" />
            </Link>
            <div className="mx-1 h-6 w-px bg-neutral-500"></div>
            <Link
              href={'#'}
              className="h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white"
            >
              <ArrowRightIcon className="h-5" />
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
