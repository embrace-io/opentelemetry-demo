import { ThemedView } from '@/components/ThemedView';
import ProductList from '@/components/ProductList';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types/Product';
import request from '@/utils/Request';
import { ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

const LABELS = {
  notFound: 'No products found, make sure the backend services for the OpenTelemetry demo are running',
}

export default function Index() {
  const { data: productList = [] } = useQuery(['products', 'USD'], () =>
     request<Product[]>({
      url: "/api/products",
      queryParams: { currencyCode: 'USD' },
    }));

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ScrollView>
        {productList.length ? <ProductList productList={productList} /> : <ThemedText>{LABELS.notFound}</ThemedText>}
      </ScrollView>
    </ThemedView>
  );
}
