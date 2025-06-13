import { authService } from '@lexora/auth';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from '@lexora/styles';
import { useAuthStore } from '@/stores/useAuthStore';
import { Icon } from '@/components/ui/Icon';

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user } = useAuthStore();

  const handleLogout = async () => {
    await authService.logout();
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerScroll}
    >
      <TouchableOpacity onPress={props.navigation.closeDrawer}>
        <Icon
          library="Ionicons"
          name="close"
          size={FontSizes.h1 * 1.5}
          color={Colors.textLight}
        />
      </TouchableOpacity>
      <SafeAreaView style={styles.drawerContainer}>
        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.displayName}>{user?.displayName}</Text>
          <Text style={styles.mail}>{user?.email}</Text>

          <View style={styles.progressContainer}>
            <Text style={styles.level}>lvl 6.</Text>
            <View style={styles.progressBarBackground}>
              <View style={styles.progressBarFill} />
            </View>
          </View>

          <View style={styles.divider} />
        </View>

        {/* Navigation */}
        <View style={styles.navSection}>
          <DrawerItemList {...props} />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.divider} />
          <TouchableOpacity onPress={handleLogout} style={styles.logoutRow}>
            <Text style={styles.logoutText}>Log out</Text>
            <Icon
              library="Feather"
              name="settings"
              size={FontSizes.body}
              color={Colors.textLight}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      initialRouteName="home"
      backBehavior="history"
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.main,
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0, // remove shadow on iOS
          borderBottomWidth: 0, // fallback
        },
        headerTitleStyle: {
          color: Colors.textLight,
          fontSize: FontSizes.h3,
          fontWeight: FontWeights.bold,
        },
        headerTintColor: Colors.textLight,
        headerTitleAlign: 'center',
      }}
    >
      <Drawer.Screen
        initialParams={{ screen: 'index' }}
        name="daily-challenge"
        options={{
          drawerLabel: 'Daily Challenge',
          title: 'Daily Challenge',
          drawerActiveTintColor: Colors.accent,
          drawerInactiveTintColor: Colors.textLight,
          drawerInactiveBackgroundColor: Colors.main,
          drawerLabelStyle: {
            fontSize: FontSizes.body,
            fontWeight: FontWeights.bold,
          },
          drawerItemStyle: {
            borderRadius: BorderRadius.l,
          },
        }}
      />
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel: 'Home',
          title: 'Home',
          drawerActiveTintColor: Colors.accent,
          drawerInactiveTintColor: Colors.textLight,
          drawerInactiveBackgroundColor: Colors.main,
          drawerLabelStyle: {
            fontSize: FontSizes.body,
            fontWeight: FontWeights.bold,
          },
          drawerItemStyle: {
            borderRadius: BorderRadius.l,
          },
        }}
      />
      <Drawer.Screen
        name="lessons"
        initialParams={{ screen: 'index' }}
        options={{
          drawerLabel: 'My Lessons',
          title: 'My Lessons',
          drawerActiveTintColor: Colors.accent,
          drawerInactiveTintColor: Colors.textLight,
          drawerInactiveBackgroundColor: Colors.main,
          drawerLabelStyle: {
            fontSize: FontSizes.body,
            fontWeight: FontWeights.bold,
          },
          drawerItemStyle: {
            borderRadius: BorderRadius.l,
          },
        }}
      />
      <Drawer.Screen
        name="new-language"
        initialParams={{ screen: 'index' }}
        options={{
          drawerLabel: 'Learn New Language',
          title: 'Learn New Language',
          drawerActiveTintColor: Colors.accent,
          drawerInactiveTintColor: Colors.textLight,
          drawerInactiveBackgroundColor: Colors.main,
          drawerLabelStyle: {
            fontSize: FontSizes.body,
            fontWeight: FontWeights.bold,
          },
          drawerItemStyle: {
            borderRadius: BorderRadius.l,
          },
        }}
      />
      <Drawer.Screen
        name="conversation"
        initialParams={{ screen: 'index' }}
        options={{
          drawerLabel: 'AI Practice',
          title: 'AI Practice',
          drawerActiveTintColor: Colors.accent,
          drawerInactiveTintColor: Colors.textLight,
          drawerInactiveBackgroundColor: Colors.main,
          drawerLabelStyle: {
            fontSize: FontSizes.body,
            fontWeight: FontWeights.bold,
          },
          drawerItemStyle: {
            borderRadius: BorderRadius.l,
          },
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerScroll: {
    flexGrow: 1,
    backgroundColor: Colors.main,
  },
  drawerContainer: {
    flex: 1,
    padding: Spacing.screenGutter,
    paddingLeft: Spacing.s,
    justifyContent: 'space-between',
  },
  userInfo: {
    marginBottom: Spacing.l,
  },
  displayName: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
  },
  mail: {
    fontSize: FontSizes.caption,
    color: Colors.textLight,
    marginBottom: Spacing.s,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
  },
  level: {
    fontSize: FontSizes.body,
    color: Colors.textLight,
  },
  progressBarBackground: {
    flex: 1,
    height: 4,
    backgroundColor: `${Colors.accent}30`,
    borderRadius: 4,
  },
  progressBarFill: {
    width: '30%',
    height: 4,
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.m,
  },
  navSection: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    marginTop: Spacing.m,
  },
  logoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
  },
});
