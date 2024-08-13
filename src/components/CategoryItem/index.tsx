import CategoryList from "types/interface/category-list.interface";

interface Props {
  categoryList: CategoryList;
}

export default function CategoryName({ categoryList }: Props) {
  return (
    <div>
      <span>{categoryList.name}</span>
    </div>
  );
}