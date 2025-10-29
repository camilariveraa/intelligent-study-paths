interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

const StepCard = ({ number, title, description }: StepCardProps) => {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-xl rounded-full" />
        <div className="relative w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
          <span className="text-2xl font-bold text-primary-foreground">{number}</span>
        </div>
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground max-w-xs leading-relaxed">{description}</p>
    </div>
  );
};

export default StepCard;
