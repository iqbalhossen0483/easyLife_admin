"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/error";
import { ProductFormValues, productSchema } from "@/schema/productSchema";
import { useCreateProductMutation } from "@/store/feature/productApi";
import { ProductCreateDialogProps } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ProductCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: ProductCreateDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setIsOpen = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const [createProduct, { isLoading }] = useCreateProductMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.short_name) formData.append("short_name", data.short_name);
      if (data.type) formData.append("type", data.type);
      formData.append("price", String(data.price));
      formData.append("cost", String(data.cost));
      if (data.sl !== undefined && !Number.isNaN(data.sl)) {
        formData.append("sl", String(data.sl));
      }
      if (data.init_stock !== undefined && !Number.isNaN(data.init_stock)) {
        formData.append("init_stock", String(data.init_stock));
      }

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      await createProduct(formData).unwrap();
      toast.success("Product created successfully!");
      setIsOpen(false);
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2">
            <Plus className="size-4" />
            <span>Add New Product</span>
          </Button>
        }
      />
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Define new SKU, initial inventory, and pricing details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-3">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Product Name *</FieldLabel>
                <Input
                  id="name"
                  placeholder="e.g. Engine Oil 20W-50"
                  {...register("name")}
                  error={!!errors.name}
                />
                <FieldError errors={[errors.name]} />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="short_name">Short Name / Code</FieldLabel>
                  <Input
                    id="short_name"
                    placeholder="e.g. OIL-20W50"
                    {...register("short_name")}
                    error={!!errors.short_name}
                  />
                  <FieldError errors={[errors.short_name]} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="type">Category / Type</FieldLabel>
                  <Input
                    id="type"
                    placeholder="e.g. Lubricants"
                    {...register("type")}
                    error={!!errors.type}
                  />
                  <FieldError errors={[errors.type]} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="cost">Cost Price (৳) *</FieldLabel>
                  <Input
                    id="cost"
                    type="number"
                    step="any"
                    placeholder="0.00"
                    {...register("cost", { valueAsNumber: true })}
                    error={!!errors.cost}
                  />
                  <FieldError errors={[errors.cost]} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="price">Selling Price (৳) *</FieldLabel>
                  <Input
                    id="price"
                    type="number"
                    step="any"
                    placeholder="0.00"
                    {...register("price", { valueAsNumber: true })}
                    error={!!errors.price}
                  />
                  <FieldError errors={[errors.price]} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="init_stock">Initial Stock</FieldLabel>
                  <Input
                    id="init_stock"
                    type="number"
                    placeholder="0"
                    {...register("init_stock", { valueAsNumber: true })}
                    error={!!errors.init_stock}
                  />
                  <FieldError errors={[errors.init_stock]} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="sl">Serial / Position</FieldLabel>
                  <Input
                    id="sl"
                    type="number"
                    placeholder="1"
                    {...register("sl", { valueAsNumber: true })}
                    error={!!errors.sl}
                  />
                  <FieldError errors={[errors.sl]} />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="image">Product Image</FieldLabel>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  {...register("image")}
                />
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Create Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
