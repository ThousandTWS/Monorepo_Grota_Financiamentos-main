import { useState } from "react"

export interface CarouselItemType {
  category: string
  title: string
  description: string
  imageSrc: string
}

export const useDialog = () => {
  const [selectedItem, setSelectedItem] = useState<CarouselItemType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handlePlusClick = (e: React.MouseEvent<HTMLButtonElement>, item: CarouselItemType) => {
    e.stopPropagation()
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  return {
    selectedItem,
    isDialogOpen,
    setIsDialogOpen,
    handlePlusClick
  }
}