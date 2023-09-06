'use client';
import Button from '@/components/Button';
import Container from '@/components/Container';
import Heading from '@/components/Heading';
import ImageUpload from '@/components/ImageUpload';
import Input from '@/components/Input';
import { categories } from '@/components/categories/Categories';
import CategoryInput from '@/components/categories/CategoryInput';
import React, { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

const ProductUploadPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      latitude: 33.5563,
      longitude: 126.79581,
      imageSrc: '',
      price: 1,
    },
  });
  const onSubmit: SubmitHandler<FieldValues> = (data) => {};

  // 이미지 경로 설정
  const imageSrc = watch('imageSrc');
  const category = watch('category');
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value);
  };

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <Heading title="Product Upload" subtitle="upload yout product" />
          <ImageUpload onChange={(value) => setCustomValue('imageSrc', value)} value={imageSrc} />
          <Input id="title" label="Title" disabled={isLoading} register={register} errors={errors} required />
          <Input
            id="description"
            label="Description"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <Input
            id="price"
            label="Price"
            formatPrice
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
            {categories.map((item) => (
              <div key={item.label} className="col-span-1">
                <CategoryInput
                  onClick={(category) => setCustomValue('category', category)}
                  selected={category === item.path}
                  label={item.label}
                  icon={item.icon}
                  path={item.path}
                />
              </div>
            ))}
          </div>
          {/* kakaomap */}
          <Button label="상품 생성하기" />
        </form>
      </div>
    </Container>
  );
};

export default ProductUploadPage;
