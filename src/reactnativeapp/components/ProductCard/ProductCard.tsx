// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import * as S from './ProductCard.styled';
import { Product } from '@/types/Product';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from 'react-native';
import { useCallback } from 'react';
import { Cart, CartItem } from '@/types/Cart';
import Toast from 'react-native-root-toast';

interface IProps {
  product: Product;
  addItem: (item:CartItem) => Promise<Cart>;
}

const ProductCard = ({
  product: {
    id,
    name,
    priceUsd = {
      currencyCode: 'USD',
      units: 0,
      nanos: 0,
    },
  },
  addItem,
}: IProps) => {
  const onAddItem = useCallback(async () => {
    await addItem({
      productId: id,
      quantity: 1,
    });
    Toast.show(`Added ${name} to cart!`, {
      duration: Toast.durations.SHORT,
    });
  }, [addItem, id]);

  return (
    <S.ProductCard>
      <ThemedView>
        <S.ProductName>{name}</S.ProductName>
        <ThemedText>
         {priceUsd.units} {priceUsd.currencyCode}
        </ThemedText>
        <Button title={"Add to Cart"} onPress={onAddItem} />
      </ThemedView>
    </S.ProductCard>
  );
};

export default ProductCard;
