import style from "./GridItem.module.css";

interface GridItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function GridItem({ children, onClick }: GridItemProps) {
  return (
    <li className={style.item} onClick={onClick}>
      {children}
    </li>
  );
}
