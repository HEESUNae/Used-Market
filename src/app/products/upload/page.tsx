'use client';
import Button from '@/components/Button';
import Container from '@/components/Container';
import Heading from '@/components/Heading';
import ImageUpload from '@/components/ImageUpload';
import Input from '@/components/Input';
import { categories } from '@/components/categories/Categories';
import CategoryInput from '@/components/categories/CategoryInput';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

const ProductUploadPage = () => {
  const router = useRouter();
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

  const imageSrc = watch('imageSrc');
  const category = watch('category');
  const latitude = watch('latitude');
  const longitude = watch('longitude');

  // 이미지 경로 설정
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value);
  };

  // 런타임 환경에서 불러오도록 설정
  const KakaoMap = dynamic(() => import('../../../components/KakaoMap'), { ssr: false });

  // 디비에 파일 업로드
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    axios
      .post('/api/products', data)
      .then((response) => {
        router.push(`/products/${response.data.id}`);
      })
      .catch((err) => {
        console.log(err.response);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
          <KakaoMap setCustomValue={setCustomValue} latitude={latitude} longitude={longitude} />
          <Button label="상품 생성하기" />
        </form>
      </div>
    </Container>
  );
};

export default ProductUploadPage;
