import React from "react";
import { Button } from "@/presentation/layout/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/layout/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      className="flex items-center justify-between px-2 py-4"
      data-oid="hg:c:7n"
    >
      <div className="flex items-center gap-6" data-oid="6e.fyes">
        <div className="flex items-center gap-2" data-oid="jgoa:m:">
          <p className="text-sm text-muted-foreground" data-oid="n5y-3-p">
            Itens por página
          </p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
            data-oid="e2-ehbw"
          >
            <SelectTrigger className="h-8 w-[70px]" data-oid="orsache">
              <SelectValue data-oid="psy3wjb" />
            </SelectTrigger>
            <SelectContent data-oid="ev9s7xh">
              <SelectItem value="10" data-oid="sr4nqbg">
                10
              </SelectItem>
              <SelectItem value="20" data-oid=".kzw4ln">
                20
              </SelectItem>
              <SelectItem value="30" data-oid="wk.78.z">
                30
              </SelectItem>
              <SelectItem value="50" data-oid="fif:gxw">
                50
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground" data-oid="o0acc2a">
          Exibindo{" "}
          <span className="font-medium" data-oid="2dpi6ao">
            {startItem}
          </span>{" "}
          até{" "}
          <span className="font-medium" data-oid="1vr7cp1">
            {endItem}
          </span>{" "}
          de{" "}
          <span className="font-medium" data-oid="q1t2nk:">
            {totalItems}
          </span>{" "}
          itens
        </p>
      </div>

      <div className="flex items-center gap-2" data-oid="px2fexj">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          data-oid="lj9fp11"
        >
          <ChevronsLeft className="h-4 w-4" data-oid="sqo2xko" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          data-oid="hofuqtk"
        >
          <ChevronLeft className="h-4 w-4" data-oid="9ziw7sv" />
        </Button>

        <div className="flex items-center gap-1" data-oid="tn_97sl">
          <p className="text-sm" data-oid=".a-823n">
            Página{" "}
            <span className="font-medium" data-oid="1_8fvue">
              {currentPage}
            </span>{" "}
            de{" "}
            <span className="font-medium" data-oid="xq5vn6c">
              {totalPages}
            </span>
          </p>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          data-oid="28exzca"
        >
          <ChevronRight className="h-4 w-4" data-oid="lkc9pt9" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          data-oid="bj2wsi9"
        >
          <ChevronsRight className="h-4 w-4" data-oid="the7n5z" />
        </Button>
      </div>
    </div>
  );
}
