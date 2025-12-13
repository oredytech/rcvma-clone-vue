import { Link } from "react-router-dom";

interface ReadAlsoCardProps {
  title: string;
  imageUrl?: string;
  slug: string;
}

const ReadAlsoCard = ({ title, imageUrl, slug }: ReadAlsoCardProps) => {
  return (
    <div className="my-6 p-4 bg-muted/30 border-l-4 border-primary rounded-r-lg">
      <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2 block">
        Lire aussi
      </span>
      <Link 
        to={`/${slug}`}
        className="flex items-center gap-4 group"
      >
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
          />
        )}
        <h4 
          className="text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </Link>
    </div>
  );
};

export default ReadAlsoCard;
