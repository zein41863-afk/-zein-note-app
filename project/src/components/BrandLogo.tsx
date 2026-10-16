type BrandLogoProps = {
  imageClassName?: string;
  showName?: boolean;
  nameClassName?: string;
  link?: boolean;
};

function BrandLogo({ imageClassName = 'h-11 w-11', showName = false, nameClassName = 'text-xl', link = false }: BrandLogoProps) {
  const content = (
    <span className="inline-flex items-center gap-2">
      <img
        src="/logo.png"
        alt="زين نوت - Logo"
        className={`shrink-0 object-contain ${imageClassName}`}
      />
      {showName && <span className={`font-cairo font-bold ${nameClassName}`}>زين نوت</span>}
    </span>
  );

  return link ? (
    <a href="/" aria-label="العودة إلى الصفحة الرئيسية" className="inline-flex transition-transform hover:scale-[1.03]">
      {content}
    </a>
  ) : content;
}

export default BrandLogo;
