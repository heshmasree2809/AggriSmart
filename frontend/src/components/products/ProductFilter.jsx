import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  IconButton,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Close,
  ExpandMore,
  FilterList,
  Clear,
  Search,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilters, clearFilters, selectFilters } from '../../store/slices/productSlice';

const ProductFilter = ({ open, onClose, categories = [], states = [] }) => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const [tempFilters, setTempFilters] = useState(filters);
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 10000]);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    setTempFilters({
      ...tempFilters,
      minPrice: newValue[0],
      maxPrice: newValue[1],
    });
  };

  const handleFilterChange = (field, value) => {
    setTempFilters({
      ...tempFilters,
      [field]: value,
    });
  };

  const handleApplyFilters = () => {
    dispatch(updateFilters(tempFilters));
    onClose();
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setTempFilters({});
    setPriceRange([0, 10000]);
  };

  const qualities = ['A', 'B', 'C'];
  const districts = [
    'Mumbai',
    'Pune',
    'Nashik',
    'Nagpur',
    'Aurangabad',
    'Solapur',
    'Kolhapur',
    'Thane',
  ];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        className: 'w-80',
      }}
    >
      <Box className="p-4 h-full overflow-y-auto">
        {/* Header */}
        <Box className="flex items-center justify-between mb-4">
          <Box className="flex items-center gap-2">
            <FilterList />
            <Typography variant="h6" className="font-semibold">
              Filters
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        <Divider className="mb-4" />

        {/* Search */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products..."
          value={tempFilters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          InputProps={{
            startAdornment: <Search className="text-gray-400 mr-2" />,
          }}
          className="mb-4"
        />

        {/* Category Filter */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography className="font-medium">Category</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth size="small">
              <Select
                value={tempFilters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                displayEmpty
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat._id} ({cat.count})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        {/* Price Range */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography className="font-medium">Price Range</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box className="px-2">
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={10000}
                step={100}
                marks={[
                  { value: 0, label: '₹0' },
                  { value: 5000, label: '₹5k' },
                  { value: 10000, label: '₹10k' },
                ]}
              />
              <Box className="flex justify-between mt-2">
                <TextField
                  size="small"
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(null, [e.target.value, priceRange[1]])}
                  className="w-24"
                  InputProps={{ startAdornment: '₹' }}
                />
                <Typography className="self-center">to</Typography>
                <TextField
                  size="small"
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(null, [priceRange[0], e.target.value])}
                  className="w-24"
                  InputProps={{ startAdornment: '₹' }}
                />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Quality Filter */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography className="font-medium">Quality</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth size="small">
              <Select
                value={tempFilters.quality || ''}
                onChange={(e) => handleFilterChange('quality', e.target.value)}
                displayEmpty
              >
                <MenuItem value="">All Qualities</MenuItem>
                {qualities.map((quality) => (
                  <MenuItem key={quality} value={quality}>
                    Grade {quality}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        {/* Location Filter */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography className="font-medium">Location</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box className="space-y-3">
              <FormControl fullWidth size="small">
                <InputLabel>State</InputLabel>
                <Select
                  value={tempFilters.state || ''}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  label="State"
                >
                  <MenuItem value="">All States</MenuItem>
                  {states.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth size="small">
                <InputLabel>District</InputLabel>
                <Select
                  value={tempFilters.district || ''}
                  onChange={(e) => handleFilterChange('district', e.target.value)}
                  label="District"
                >
                  <MenuItem value="">All Districts</MenuItem>
                  {districts.map((district) => (
                    <MenuItem key={district} value={district}>
                      {district}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Additional Filters */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography className="font-medium">Additional Filters</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={tempFilters.organic || false}
                    onChange={(e) => handleFilterChange('organic', e.target.checked)}
                  />
                }
                label="Organic Only"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={tempFilters.featured || false}
                    onChange={(e) => handleFilterChange('featured', e.target.checked)}
                  />
                }
                label="Featured Products"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={tempFilters.bulkAvailable || false}
                    onChange={(e) => handleFilterChange('bulkAvailable', e.target.checked)}
                  />
                }
                label="Bulk Pricing Available"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={tempFilters.freeDelivery || false}
                    onChange={(e) => handleFilterChange('freeDelivery', e.target.checked)}
                  />
                }
                label="Free Delivery"
              />
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        {/* Sort Options */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography className="font-medium">Sort By</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth size="small">
              <Select
                value={`${tempFilters.sortBy || 'createdAt'}_${tempFilters.order || 'desc'}`}
                onChange={(e) => {
                  const [sortBy, order] = e.target.value.split('_');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('order', order);
                }}
              >
                <MenuItem value="createdAt_desc">Newest First</MenuItem>
                <MenuItem value="createdAt_asc">Oldest First</MenuItem>
                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                <MenuItem value="price_desc">Price: High to Low</MenuItem>
                <MenuItem value="rating_desc">Highest Rated</MenuItem>
                <MenuItem value="name_asc">Name: A to Z</MenuItem>
                <MenuItem value="name_desc">Name: Z to A</MenuItem>
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        {/* Applied Filters */}
        {Object.keys(tempFilters).length > 0 && (
          <Box className="mt-4 p-3 bg-gray-50 rounded">
            <Typography variant="subtitle2" className="font-medium mb-2">
              Applied Filters
            </Typography>
            <Box className="flex flex-wrap gap-2">
              {Object.entries(tempFilters).map(([key, value]) => {
                if (value && key !== 'sortBy' && key !== 'order') {
                  return (
                    <Chip
                      key={key}
                      label={`${key}: ${value}`}
                      onDelete={() => handleFilterChange(key, '')}
                      size="small"
                      className="text-xs"
                    />
                  );
                }
                return null;
              })}
            </Box>
          </Box>
        )}

        {/* Action Buttons */}
        <Box className="flex gap-2 mt-6 sticky bottom-0 bg-white pt-4 pb-2">
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Clear />}
            onClick={handleClearFilters}
          >
            Clear All
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={handleApplyFilters}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            Apply Filters
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ProductFilter;
