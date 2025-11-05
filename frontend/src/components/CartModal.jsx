import React from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Chip,
  Stack,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/helpers';

const CartModal = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  const deliveryCharge = getCartTotal() >= 500 ? 0 : 40;
  const gst = getCartTotal() * 0.05; // 5% GST
  const finalTotal = getCartTotal() + deliveryCharge + gst;

  const handleGetPrice = (item) => {
    let price = 0;
    if (item.finalPrice) {
      price = parseFloat(item.finalPrice);
    } else if (typeof item.price === 'number') {
      price = item.price;
    } else if (typeof item.price === 'string') {
      price = parseFloat(item.price.replace(/[₹,]/g, '')) || 0;
    }
    return price;
  };

  return (
    <Drawer
      anchor="right"
      open={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 420 }, maxWidth: '100vw' }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ShoppingCartIcon />
            <Typography variant="h6" fontWeight="bold">
              Shopping Cart
            </Typography>
          </Box>
          <IconButton
            onClick={() => setIsCartOpen(false)}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Cart Items */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          {cartItems.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                gap: 2
              }}
            >
              <Typography variant="h1">🛒</Typography>
              <Typography variant="h6" fontWeight="bold">
                Your cart is empty
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add some fresh vegetables to get started!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsCartOpen(false)}
                sx={{ mt: 2 }}
              >
                Continue Shopping
              </Button>
            </Box>
          ) : (
            <List>
              {cartItems.map((item) => {
                const itemPrice = handleGetPrice(item);
                return (
                  <Paper
                    key={item.id}
                    elevation={1}
                    sx={{ mb: 1.5, p: 1.5 }}
                  >
                    <ListItem disablePadding>
                      <ListItemAvatar sx={{ minWidth: 56 }}>
                        <Avatar
                          variant="rounded"
                          src={item.imageUrl || item.image}
                          sx={{ width: 40, height: 40, bgcolor: 'primary.light' }}
                        >
                          {(item.imageUrl || item.image) ? null : '🌱'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight="medium">
                            {item.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {formatCurrency(itemPrice)} per {item.unit || 'kg'}
                          </Typography>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => removeFromCart(item.id)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    {/* Quantity Controls */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1.5 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        sx={{ minWidth: 32, p: 0.5 }}
                      >
                        <RemoveIcon fontSize="small" />
                      </Button>
                      <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 50, textAlign: 'center' }}>
                        {item.quantity} {item.unit || 'kg'}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        sx={{ minWidth: 32, p: 0.5 }}
                      >
                        <AddIcon fontSize="small" />
                      </Button>
                      <Typography
                        variant="body1"
                        color="primary"
                        fontWeight="bold"
                        sx={{ ml: 'auto' }}
                      >
                        {formatCurrency(itemPrice * item.quantity)}
                      </Typography>
                    </Box>
                  </Paper>
                );
              })}
            </List>
          )}
        </Box>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <Box sx={{ borderTop: 1, borderColor: 'divider', p: 3, bgcolor: 'grey.50' }}>
            <Stack spacing={1.5} mb={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                <Typography variant="body2" fontWeight="medium">
                  {formatCurrency(getCartTotal())}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Delivery Charge</Typography>
                <Chip
                  label={deliveryCharge === 0 ? 'FREE' : formatCurrency(deliveryCharge)}
                  color={deliveryCharge === 0 ? 'success' : 'default'}
                  size="small"
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">GST (5%)</Typography>
                <Typography variant="body2" fontWeight="medium">
                  {formatCurrency(gst)}
                </Typography>
              </Box>
              {getCartTotal() < 500 && (
                <Alert severity="info" sx={{ py: 0.5 }}>
                  Add {formatCurrency(500 - getCartTotal())} more for free delivery!
                </Alert>
              )}
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight="bold">Total</Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {formatCurrency(finalTotal)}
                </Typography>
              </Box>
            </Stack>

            {/* Checkout Button */}
            <Button
              component={Link}
              to="/payment"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => setIsCartOpen(false)}
              sx={{ py: 1.5, fontWeight: 'bold' }}
            >
              Proceed to Checkout
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default CartModal;
