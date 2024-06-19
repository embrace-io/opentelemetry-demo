// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import ProductCard from '../ProductCard';
import * as S from './ProductList.styled';
import { Product } from '@/types/Product';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Cart, CartItem } from '@/types/Cart';
import request from '@/utils/Request';
import { useCallback } from 'react';

interface IProps {
  productList: Product[];
}

const ProductList = ({ productList }: IProps) => {
  const queryClient = useQueryClient()
  const addCartMutation = useMutation((item: CartItem) =>
    request<Cart>({
      url: "/api/cart",
      body: { item, userId: "react-native-user" },
      queryParams: { currencyCode: 'USD' },
      method: 'POST',
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      },
    }
  );
  const addItem = useCallback(
    (item: CartItem) => addCartMutation.mutateAsync(item),
    [addCartMutation]
  );

  return (
    <S.ProductList>
      {productList.map(product => (
        <ProductCard key={product.id} product={product} addItem={addItem} />
      ))}
    </S.ProductList>
  );
};

export default ProductList;
