import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Mock Data for Near-Expiry Flash Deals
const FLASH_DEALS = [
  {
    id: "1",
    name: "Organic Whole Milk",
    originalPrice: "₹60",
    discountedPrice: "₹25",
    discount: "58% OFF",
    expiry: "Expires in 6 hours",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400",
  },
  {
    id: "2",
    name: "Fresh Strawberries (250g)",
    originalPrice: "₹180",
    discountedPrice: "₹80",
    discount: "55% OFF",
    expiry: "Expires in 12 hours",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400",
  },
  {
    id: "3",
    name: "Whole Wheat Bread",
    originalPrice: "₹50",
    discountedPrice: "₹20",
    discount: "60% OFF",
    expiry: "Expires in 4 hours",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* 1. Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hello, Eco Shopper! 👋</Text>
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={14} color="#4CAF50" />
            <Text style={styles.locationText}>Kochi, India</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.notificationBadge}
          onPress={() => router.push("/notifications" as Href)}
        >
          <Feather name="bell" size={22} color="#333" />
          <View style={styles.badgeDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* 2. Search Bar */}
        <View style={styles.searchContainer}>
          <Feather
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search surplus surplus groceries near you..."
            placeholderTextColor="#999"
          />
        </View>

        {/* 3. Sustainability Impact Dashboard (Great for Ideathon Pitch) */}
        <View style={styles.impactCard}>
          <View style={styles.impactHeader}>
            <MaterialCommunityIcons name="leaf" size={22} color="#fff" />
            <Text style={styles.impactTitle}>Your Green Impact</Text>
          </View>
          <View style={styles.impactStatsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>4.2 kg</Text>
              <Text style={styles.statLabel}>Waste Prevented</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>₹680</Text>
              <Text style={styles.statLabel}>Money Saved</Text>
            </View>
          </View>
        </View>

        {/* 4. Near-Expiry Flash Sales Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⚡ Near-Expiry Flash Deals</Text>
          <TouchableOpacity onPress={() => router.push("/deals" as Href)}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flashScroll}
        >
          {FLASH_DEALS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.flashCard}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.discountTag}>
                <Text style={styles.discountText}>{item.discount}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.expiryText}>{item.expiry}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.discountedPrice}>
                    {item.discountedPrice}
                  </Text>
                  <Text style={styles.originalPrice}>{item.originalPrice}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 5. Categories Grid */}
        <Text style={styles.sectionTitle}>Browse Categories</Text>
        <View style={styles.categoryGrid}>
          {[
            {
              name: "Dairy & Eggs",
              icon: "egg-cheese",
              color: "#FFF3E0",
              iconColor: "#FF9800",
            },
            {
              name: "Fruits & Veg",
              icon: "food-apple",
              color: "#E8F5E9",
              iconColor: "#4CAF50",
            },
            {
              name: "Bakery",
              icon: "bread-slice",
              color: "#EFEBE9",
              iconColor: "#795548",
            },
            {
              name: "Meat & Fish",
              icon: "food-steak",
              color: "#FFEBEE",
              iconColor: "#F44336",
            },
          ].map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.categoryCard, { backgroundColor: cat.color }]}
            >
              <MaterialCommunityIcons
                name={cat.icon as any}
                size={32}
                color={cat.iconColor}
              />
              <Text style={styles.categoryLabel}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  notificationBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeDot: {
    position: "absolute",
    top: 12,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff4d4f",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  impactCard: {
    backgroundColor: "#4CAF50",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  impactHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  impactTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  impactStatsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#E8F5E9",
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  seeAllText: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  flashScroll: {
    paddingLeft: 16,
    paddingBottom: 20,
  },
  flashCard: {
    width: width * 0.42,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 110,
    backgroundColor: "#f9f9f9",
  },
  discountTag: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#E91E63",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  discountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  cardContent: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  expiryText: {
    fontSize: 11,
    color: "#ff4d4f",
    marginTop: 2,
    fontWeight: "500",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  categoryCard: {
    width: "47%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  categoryLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});
