interface CardProps {
  title: string;
  description: string;
}

export const Card = ({ title, description }: CardProps) => {
  return (
    <div className="border p-2 mb-2 bg-white rounded shadow">
      <h4 className="font-bold">{title}</h4>
      <p>{description}</p>
    </div>
  );
};