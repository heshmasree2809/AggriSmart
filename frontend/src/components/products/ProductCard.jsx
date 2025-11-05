import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Rating,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  LocalShipping,
  Verified,
  Timer,
  Store,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductCard = ({ product, index = 0 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '/placeholder.jpg',
      seller: product.seller?.name,
      unit: product.unit,
    }));
    toast.success(`${product.name} added to cart`);
  };

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    toast.success(
      isFavorite ? 'Removed from favorites' : 'Added to favorites'
    );
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card
        className="h-full cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
        onClick={handleCardClick}
      >
        <Box className="relative">
          <CardMedia
            component="img"
            height="200"
            image={
              imageError
                ? '/placeholder.jpg'
                : product.images?.[0] || '/placeholder.jpg'
            }
            alt={product.name}
            onError={() => setImageError(true)}
            className="h-48 object-cover"
          />
          
          {/* Badges */}
          <Box className="absolute top-2 left-2 flex flex-col gap-1">
            {product.organic && (
              <Chip
                size="small"
                label="Organic"
                color="success"
                icon={<Verified />}
                className="bg-green-600 text-white"
              />
            )}
            {product.isFeatured && (
              <Chip
                size="small"
                label="Featured"
                color="primary"
                className="bg-blue-600 text-white"
              />
            )}
            {product.quality && (
              <Chip
                size="small"
                label={`Grade ${product.quality}`}
                className="bg-yellow-600 text-white"
              />
            )}
          </Box>

          {/* Favorite Button */}
          <IconButton
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={handleFavoriteToggle}
            size="small"
          >
            {isFavorite ? (
              <Favorite className="text-red-500" />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>

          {/* Stock Badge */}
          {product.quantity <= 5 && product.quantity > 0 && (
            <Chip
              size="small"
              label={`Only ${product.quantity} left`}
              className="absolute bottom-2 right-2 bg-orange-600 text-white"
              icon={<Timer />}
            />
          )}
        </Box>

        <CardContent className="pb-2">
          {/* Product Name */}
          <Typography
            variant="h6"
            component="h2"
            className="font-semibold text-gray-800 line-clamp-1"
          >
            {product.name}
          </Typography>

          {/* Seller Info */}
          <Box className="flex items-center gap-1 mt-1 mb-2">
            <Store className="text-gray-500" fontSize="small" />
            <Typography variant="caption" className="text-gray-600">
              {product.seller?.name || 'Unknown Seller'}
            </Typography>
            {product.location && (
              <Typography variant="caption" className="text-gray-500">
                • {product.location.district}
              </Typography>
            )}
          </Box>

          {/* Rating */}
          {product.ratings && (
            <Box className="flex items-center gap-1 mb-2">
              <Rating
                value={product.ratings.average}
                readOnly
                size="small"
                precision={0.5}
              />
              <Typography variant="caption" className="text-gray-600">
                ({product.ratings.count})
              </Typography>
            </Box>
          )}

          {/* Price and Unit */}
          <Box className="flex items-baseline justify-between">
            <Box>
              <Typography
                variant="h5"
                component="span"
                className="font-bold text-green-600"
              >
                ₹{product.price}
              </Typography>
              <Typography
                variant="body2"
                component="span"
                className="text-gray-600 ml-1"
              >
                /{product.unit}
              </Typography>
            </Box>
            
            {product.bulkPricing?.enabled && (
              <Tooltip title={`Bulk: ₹${product.bulkPricing.price}/${product.unit} (Min: ${product.bulkPricing.minimumQuantity})`}>
                <Chip
                  size="small"
                  label="B2B"
                  variant="outlined"
                  className="text-xs"
                />
              </Tooltip>
            )}
          </Box>

          {/* Additional Info */}
          <Box className="flex items-center gap-2 mt-2">
            {product.minimumOrder > 1 && (
              <Typography variant="caption" className="text-gray-600">
                Min: {product.minimumOrder} {product.unit}
              </Typography>
            )}
            {product.harvestDate && (
              <Typography variant="caption" className="text-green-600">
                Fresh harvest
              </Typography>
            )}
          </Box>
        </CardContent>

        <CardActions className="px-4 pb-3 pt-0">
          {product.quantity > 0 ? (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              Add to Cart
            </Button>
          ) : (
            <Button
              variant="outlined"
              fullWidth
              disabled
              className="text-gray-400 border-gray-300"
            >
              Out of Stock
            </Button>
          )}
        </CardActions>

        {/* Free Delivery Badge */}
        {product.price > 500 && (
          <Box className="bg-blue-50 px-3 py-1 flex items-center justify-center gap-1">
            <LocalShipping className="text-blue-600" fontSize="small" />
            <Typography variant="caption" className="text-blue-600 font-medium">
              Free Delivery
            </Typography>
          </Box>
        )}
      </Card>
    </motion.div>
  );
};

export default ProductCard;
