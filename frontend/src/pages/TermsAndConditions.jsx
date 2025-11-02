import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Paper, Typography, Box, Divider, Alert, Accordion, AccordionSummary, AccordionDetails, Button, Chip } from '@mui/material';
import { ExpandMore, Article, Warning, CheckCircle, Info, Gavel, Shield } from '@mui/icons-material';

const TermsAndConditions = () => {
  const sections = [
    {
      title: 'User Agreement',
      icon: <Gavel />,
      content: 'By using AgriSmart, you agree to comply with all applicable laws and regulations. You must be at least 18 years old to use our services.'
    },
    {
      title: 'Privacy & Data',
      icon: <Shield />,
      content: 'We protect your personal information according to our Privacy Policy. Your data will never be shared without your consent.'
    },
    {
      title: 'Payment Terms',
      icon: <CheckCircle />,
      content: 'All payments are processed securely. Refunds are available within 7 days of purchase for eligible products.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <Container maxWidth="lg">
        {/* Header */}
        <Box className="text-center mb-8 animate-fade-in">
          <Paper 
            elevation={3} 
            className="inline-block p-4 rounded-full mb-4 bg-gradient-to-br from-green-500 to-emerald-600"
          >
            <Article sx={{ fontSize: 48, color: 'white' }} />
          </Paper>
          <Typography variant="h2" className="font-bold text-gray-900 mb-2">
            Terms and Conditions
          </Typography>
          <Chip 
            label="Last updated: November 1, 2025" 
            color="primary" 
            variant="outlined"
            className="mt-2"
          />
        </Box>

        {/* Main Content */}
        <Paper elevation={4} className="rounded-3xl overflow-hidden animate-slide-up">
          <Box className="p-8 space-y-6">
            {/* Development Notice */}
            <Alert 
              severity="warning" 
              icon={<Warning fontSize="large" />}
              className="border-2 border-yellow-400"
            >
              <Typography variant="h6" className="font-bold mb-2">
                Development Notice
              </Typography>
              <Typography variant="body2">
                <strong>IMPORTANT:</strong> This website is currently under development. Please do not trust information blindly. 
                Features and services are subject to change without notice. Use at your own discretion and verify all 
                information independently before making any decisions.
              </Typography>
            </Alert>

            {/* Introduction */}
            <Box>
              <Typography variant="h4" className="font-bold text-gray-900 mb-4 flex items-center">
                <Info className="mr-2 text-green-600" />
                Introduction
              </Typography>
              <Typography variant="body1" className="text-gray-700 leading-relaxed">
                Welcome to AgriSmart. By accessing or using our website and services, you agree to be bound by these 
                Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.
              </Typography>
            </Box>

            <Divider className="my-6" />

            {/* Accordion Sections */}
            <Box className="space-y-4">
              {sections.map((section, index) => (
                <Accordion 
                  key={index}
                  className="rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
                  sx={{ 
                    '&:before': { display: 'none' },
                    borderRadius: '16px !important',
                    overflow: 'hidden'
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    className="bg-gradient-to-r from-green-50 to-emerald-50"
                  >
                    <Box className="flex items-center">
                      <Box className="text-green-600 mr-3">{section.icon}</Box>
                      <Typography variant="h6" className="font-semibold">
                        {section.title}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails className="bg-white">
                    <Typography variant="body1" className="text-gray-700">
                      {section.content}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            {/* Payment and Refund Policy */}
            <Box>
              <Typography variant="h5" className="font-bold text-gray-900 mb-4 flex items-center">
                💳 Payment and Refund Policy
              </Typography>
              <Alert severity="error" className="mb-4">
                <Typography variant="body1" className="font-semibold">
                  All payments made on this platform are NON-REFUNDABLE.
                </Typography>
              </Alert>
              <Box component="ul" className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>All sales are final once payment is processed</li>
                <li>No refunds will be issued for any reason</li>
                <li>By making a payment, you acknowledge and accept this non-refundable policy</li>
                <li>Ensure you carefully review your purchase before completing the transaction</li>
              </Box>
            </Box>

            <Divider className="my-6" />

            {/* User Responsibilities */}
            <Box>
              <Typography variant="h5" className="font-bold text-gray-900 mb-4 flex items-center">
                👤 User Responsibilities
              </Typography>
              <Box component="ul" className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>You must provide accurate and complete information when registering</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You must not use the service for any illegal or unauthorized purpose</li>
                <li>You agree to use the platform responsibly and ethically</li>
                <li>You must not attempt to interfere with the proper functioning of the website</li>
              </Box>
            </Box>

            <Divider className="my-6" />

            {/* Service Availability */}
            <Box>
              <Typography variant="h5" className="font-bold text-gray-900 mb-4 flex items-center">
                🌐 Service Availability
              </Typography>
              <Typography variant="body1" className="text-gray-700 leading-relaxed">
                We strive to maintain service availability but do not guarantee uninterrupted access. The service may be 
                temporarily unavailable for maintenance, updates, or due to circumstances beyond our control. We are not 
                liable for any losses or damages resulting from service interruptions.
              </Typography>
            </Box>

            <Divider className="my-6" />

            {/* Contact Information */}
            <Box>
              <Typography variant="h5" className="font-bold text-gray-900 mb-4 flex items-center">
                📧 Contact Us
              </Typography>
              <Typography variant="body1" className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us at:{' '}
                <Link to="mailto:support@agrismart.com" className="text-green-600 hover:text-green-700 font-medium">
                  support@agrismart.com
                </Link>
              </Typography>
            </Box>

            {/* Acceptance */}
            <Alert severity="success" className="mt-8">
              <Typography variant="body1" className="font-semibold">
                ✓ By using AgriSmart, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </Typography>
            </Alert>
          </Box>
        </Paper>

          {/* Back to Home Button */}
        <Box className="text-center mt-8">
          <Button
            component={Link}
            to="/"
            variant="contained"
            size="large"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          >
            ← Back to Home
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default TermsAndConditions;
