import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getSubscription, isSubscriptionActive } from "@/lib/stripe";
import { StripeSubscription } from "@/types/stripe";
import { useUser } from "@/context/UserContext";

interface SubscriptionContextType {
  subscription: StripeSubscription | null;
  isLoading: boolean;
  isActive: boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useUser();
  const [subscription, setSubscription] = useState<StripeSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!currentUser) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await getSubscription();
      setSubscription(data);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [currentUser]);

  const refreshSubscription = async () => {
    await fetchSubscription();
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isLoading,
        isActive: isSubscriptionActive(subscription),
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}