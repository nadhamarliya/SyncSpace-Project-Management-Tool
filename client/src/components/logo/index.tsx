import { Link } from "react-router-dom";

const Logo = (props: { url?: string }) => {
  const { url = "/" } = props;
  return (
    <div className="flex items-center justify-center sm:justify-start">
      <Link to={url}>
          <img src="/src/assets/logo2.png" alt="Company Logo" className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground"></img>
      </Link>
    </div>
  );
};

export default Logo;
