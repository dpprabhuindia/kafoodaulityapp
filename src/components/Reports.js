import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar, Filter, FileText, Users, DollarSign, Image, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Reports = () => {
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('monthly');
  const [selectedScheme, setSelectedScheme] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [selectedInspection, setSelectedInspection] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const reportTypes = [
    { id: 'overview', name: 'Overview Report', icon: BarChart3 },
    { id: 'gallery', name: 'Photo Gallery', icon: Image },
    { id: 'financial', name: 'Financial Report', icon: DollarSign },
    { id: 'beneficiary', name: 'Beneficiary Report', icon: Users },
    { id: 'audit', name: 'Audit Report', icon: FileText }
  ];

  const schemes = ['All Schemes', 'Pre-Matric Scholarship', 'Post-Matric Scholarship', 'Skill Development Program', 'Self Employment Scheme'];

  // Available schools for filtering
  const schools = [
    'All Schools',
    'Government High School Bangalore North',
    'Government Primary School Mysore', 
    'Government Higher Secondary School Hubli',
    'Government Primary School Mangalore'
  ];

  // Available inspections for filtering
  const inspections = [
    'All Inspections',
    'Routine Inspections',
    'Complaint-based Inspections',
    'Follow-up Inspections',
    'Surprise Inspections'
  ];

  // Sample data for category distribution
  const categoryDistribution = [
    { category: 'Food Quality', percentage: 75 },
    { category: 'Hygiene', percentage: 85 },
    { category: 'Safety Standards', percentage: 90 },
    { category: 'Documentation', percentage: 65 },
    { category: 'Staff Training', percentage: 70 }
  ];

  // Sample food inspection reports data
  const foodInspectionReports = [
    {
      id: 1,
      location: "Government Primary School, Bangalore North",
      date: "2024-01-15",
      inspector: "Dr. Priya Sharma",
      rating: "A+",
      photos: [
        {
          url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPCEtLSBDbGVhbiBLaXRjaGVuIEltYWdlIC0tPgogIDxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjBGOEZGIi8+CiAgPCEtLSBLaXRjaGVuIENvdW50ZXIgLS0+CiAgPHJlY3QgeD0iMjAiIHk9IjE0MCIgd2lkdGg9IjI2MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI0Q2RUFGOCIgcng9IjUiLz4KICA8IS0tIENvb2tpbmcgUG90cyAtLT4KICA8Y2lyY2xlIGN4PSI4MCIgY3k9IjEyMCIgcj0iMjAiIGZpbGw9IiM2Mzc1RjQiLz4KICA8Y2lyY2xlIGN4PSIxNDAiIGN5PSIxMjAiIHI9IjE4IiBmaWxsPSIjNDMzOENBIi8+CiAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTIwIiByPSIyMiIgZmlsbD0iIzM3MzBBMyIvPgogIDwhLS0gVmVnZXRhYmxlcyAtLT4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjgwIiByPSI4IiBmaWxsPSIjMTBCOTgxIi8+CiAgPGNpcmNsZSBjeD0iNzAiIGN5PSI3MCIgcj0iNiIgZmlsbD0iI0Y1OTcxNiIvPgogIDxjaXJjbGUgY3g9IjkwIiBjeT0iNzUiIHI9IjciIGZpbGw9IiNEQzI2MjYiLz4KICA8IS0tIFRpdGxlIC0tPgogIDx0ZXh0IHg9IjE1MCIgeT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMxRjJBMzciIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiPkNsZWFuIEtpdGNoZW48L3RleHQ+CiAgPHRleHQgeD0iMTUwIiB5PSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzM3NEY2OCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIj5IeWdpZW5pYyBGb29kIFByZXBhcmF0aW9uPC90ZXh0Pgo8L3N2Zz4=",
          caption: "Clean kitchen with proper utensils"
        },
        {
          url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPCEtLSBGcmVzaCBGb29kIEltYWdlIC0tPgogIDxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkVGN0VEIi8+CiAgPCEtLSBQbGF0ZSAtLT4KICA8ZWxsaXBzZSBjeD0iMTUwIiBjeT0iMTMwIiByeD0iODAiIHJ5PSI0MCIgZmlsbD0iI0ZGRkZGRiIgc3Ryb2tlPSIjRDFEOEUwIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8IS0tIFJpY2UgLS0+CiAgPGVsbGlwc2UgY3g9IjEyMCIgY3k9IjEyMCIgcng9IjI1IiByeT0iMTUiIGZpbGw9IiNGRkZGRkYiLz4KICA8IS0tIERhbCAtLT4KICA8ZWxsaXBzZSBjeD0iMTgwIiBjeT0iMTIwIiByeD0iMjAiIHJ5PSIxMiIgZmlsbD0iI0Y1OTcxNiIvPgogIDwhLS0gVmVnZXRhYmxlcyAtLT4KICA8ZWxsaXBzZSBjeD0iMTUwIiBjeT0iMTQwIiByeD0iMTUiIHJ5PSIxMCIgZmlsbD0iIzEwQjk4MSIvPgogIDx0ZXh0IHg9IjE1MCIgeT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMxRjJBMzciIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiPkZyZXNoIE1lYWw8L3RleHQ+CiAgPHRleHQgeD0iMTUwIiB5PSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzM3NEY2OCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIj5OdXRyaXRpb3VzIEJhbGFuY2VkIERpZXQ8L3RleHQ+Cjwvc3ZnPg==",
          caption: "Nutritious balanced meal served"
        }
      ],
      findings: ["Excellent hygiene standards", "Fresh ingredients used", "Proper food storage"],
      violations: []
    },
    {
      id: 2,
      location: "Government High School, Mysore",
      date: "2024-01-18",
      inspector: "Mr. Rajesh Kumar",
      rating: "B+",
      photos: [
        {
          url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPCEtLSBTdG9yYWdlIEFyZWEgLS0+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGRkY3RUQiLz4KICA8IS0tIFNoZWx2ZXMgLS0+CiAgPHJlY3QgeD0iMjAiIHk9IjYwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjE1IiBmaWxsPSIjOEI1Q0Y2Ii8+CiAgPHJlY3QgeD0iMjAiIHk9IjEwMCIgd2lkdGg9IjI2MCIgaGVpZ2h0PSIxNSIgZmlsbD0iIzhCNUNGNiIvPgogIDxyZWN0IHg9IjIwIiB5PSIxNDAiIHdpZHRoPSIyNjAiIGhlaWdodD0iMTUiIGZpbGw9IiM4QjVDRjYiLz4KICA8IS0tIEZvb2QgQ29udGFpbmVycyAtLT4KICA8cmVjdCB4PSI0MCIgeT0iNDAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIyMCIgZmlsbD0iI0Y5FEFBMCJ+CiAgPHJlY3QgeD0iMTAwIiB5PSI0MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjRkJCRjI0Ii8+CiAgPHJlY3QgeD0iMTYwIiB5PSI0MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjRkE4MDcyIi8+CiAgPCEtLSBUaXRsZSAtLT4KICA8dGV4dCB4PSIxNTAiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMUYyQTM3IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIj5Gb29kIFN0b3JhZ2U8L3RleHQ+CiAgPHRleHQgeD0iMTUwIiB5PSIxODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMzNzRGNjgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+T3JnYW5pemVkIFN0b3JhZ2UgQXJlYTwvdGV4dD4KPC9zdmc+",
          caption: "Well-organized food storage area"
        },
        {
          url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPCEtLSBXYXNoaW5nIEFyZWEgLS0+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFRkY2RkYiLz4KICA8IS0tIFNpbmsgLS0+CiAgPHJlY3QgeD0iNTAiIHk9IjEwMCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSI2MCIgZmlsbD0iI0Q2RUFGOCIgcng9IjEwIi8+CiAgPCEtLSBXYXRlciBUYXAgLS0+CiAgPHJlY3QgeD0iMTQwIiB5PSI4MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjNjM3NUY0Ii8+CiAgPCEtLSBXYXRlciBEcm9wcyAtLT4KICA8Y2lyY2xlIGN4PSIxNDUiIGN5PSIxMjAiIHI9IjMiIGZpbGw9IiMwNkI2RDQiLz4KICA8Y2lyY2xlIGN4PSIxNTUiIGN5PSIxMjUiIHI9IjIiIGZpbGw9IiMwNkI2RDQiLz4KICA8IS0tIFNvYXAgLS0+CiAgPGNpcmNsZSBjeD0iMjIwIiBjeT0iMTIwIiByPSIxMCIgZmlsbD0iI0Y5FEFBMCJ+CiAgPHRleHQgeD0iMTUwIiB5PSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzFGMkEzNyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCI+V2FzaGluZyBBcmVhPC90ZXh0PgogIDx0ZXh0IHg9IjE1MCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzc0RjY4IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkNsZWFuIFdhc2hpbmcgRmFjaWxpdGllczwvdGV4dD4KPC9zdmc+",
          caption: "Clean washing facilities available"
        }
      ],
      findings: ["Good storage practices", "Clean washing area", "Minor improvements needed"],
      violations: ["Expired items found in storage"]
    },
    {
      id: 3,
      location: "Government School, Hubli",
      date: "2024-01-20",
      inspector: "Ms. Lakshmi Devi",
      rating: "C",
      photos: [
        {
          url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPCEtLSBJc3N1ZXMgRm91bmQgLS0+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGRUY3RUQiLz4KICA8IS0tIERpcnR5IFN1cmZhY2UgLS0+CiAgPHJlY3QgeD0iMjAiIHk9IjE0MCIgd2lkdGg9IjI2MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI0ZCQkYyNCIgcng9IjUiLz4KICA8IS0tIFNwb3RzIC0tPgogIDxjaXJjbGUgY3g9IjgwIiBjeT0iMTIwIiByPSI4IiBmaWxsPSIjRjU5NzE2Ii8+CiAgPGNpcmNsZSBjeD0iMTQwIiBjeT0iMTEwIiByPSI2IiBmaWxsPSIjRjU5NzE2Ii8+CiAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTI1IiByPSI3IiBmaWxsPSIjRjU5NzE2Ii8+CiAgPCEtLSBXYXJuaW5nIFNpZ24gLS0+CiAgPHBvbHlnb24gcG9pbnRzPSIxNTAsNTAgMTMwLDkwIDE3MCw5MCIgZmlsbD0iI0Y1OTcxNiIvPgogIDx0ZXh0IHg9IjE1MCIgeT0iNzgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNGRkZGRkYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9ImJvbGQiPiE8L3RleHQ+CiAgPHRleHQgeD0iMTUwIiB5PSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzFGMkEzNyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCI+SHlnaWVuZSBJc3N1ZXM8L3RleHQ+CiAgPHRleHQgeD0iMTUwIiB5PSIxODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMzNzRGNjgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+SW1wcm92ZW1lbnRzIE5lZWRlZDwvdGV4dD4KPC9zdmc+",
          caption: "Hygiene issues identified"
        },
        {
          url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPCEtLSBDbGVhbmluZyBTdXBwbGllcyAtLT4KICA8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0VGRjZGRiIvPgogIDwhLS0gQ2xlYW5pbmcgQm90dGxlcyAtLT4KICA8cmVjdCB4PSI2MCIgeT0iMTAwIiB3aWR0aD0iMjAiIGhlaWdodD0iNjAiIGZpbGw9IiMxMEI5ODEiIHJ4PSI1Ii8+CiAgPHJlY3QgeD0iMTAwIiB5PSI5MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjcwIiBmaWxsPSIjMDZCNkQ0IiByeD0iNSIvPgogIDxyZWN0IHg9IjE0MCIgeT0iMTA1IiB3aWR0aD0iMjAiIGhlaWdodD0iNTUiIGZpbGw9IiNGNTk3MTYiIHJ4PSI1Ii8+CiAgPCEtLSBDbGVhbmluZyBDbG90aCAtLT4KICA8ZWxsaXBzZSBjeD0iMjAwIiBjeT0iMTMwIiByeD0iMzAiIHJ5PSIyMCIgZmlsbD0iI0ZCQkYyNCIvPgogIDx0ZXh0IHg9IjE1MCIgeT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMxRjJBMzciIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiPkNsZWFuaW5nIFN1cHBsaWVzPC90ZXh0PgogIDx0ZXh0IHg9IjE1MCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzc0RjY4IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkFkZXF1YXRlIFN1cHBsaWVzIEF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+",
          caption: "Adequate cleaning supplies available"
        }
      ],
      findings: ["Cleaning supplies available", "Staff training needed"],
      violations: ["Poor surface cleanliness", "Inadequate hand washing facilities"]
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilteredInspections = () => {
    let filtered = [...foodInspectionReports];
    
    // Filter by school
    if (selectedSchool !== 'All Schools') {
      filtered = filtered.filter(report => report.location === selectedSchool);
    }
    
    // Filter by inspection type
    if (selectedInspection !== 'All Inspections') {
      const inspectionTypeMap = {
        'Routine Inspections': 'routine',
        'Complaint-based Inspections': 'complaint',
        'Follow-up Inspections': 'follow-up',
        'Surprise Inspections': 'surprise'
      };
      const inspectionType = inspectionTypeMap[selectedInspection];
      // For demo purposes, we'll filter based on rating as a proxy for inspection type
      if (inspectionType === 'routine') {
        filtered = filtered.filter(report => ['A+', 'A', 'B+'].includes(report.rating));
      } else if (inspectionType === 'complaint') {
        filtered = filtered.filter(report => ['C', 'D'].includes(report.rating));
      }
    }
    
    return filtered;
  };

  const generateReport = () => {
    // Generate comprehensive report including food inspection data
    const selectedReportType = reportTypes.find(r => r.id === reportType)?.name;
    const filteredInspections = getFilteredInspections();
    
    let reportData = {
      type: selectedReportType,
      dateRange: dateRange,
      scheme: selectedScheme,
      school: selectedSchool,
      inspection: selectedInspection,
      generatedAt: new Date().toLocaleString(),
      summary: {
        totalInspections: filteredInspections.length,
        averageRating: calculateAverageRating(filteredInspections),
        totalViolations: getTotalViolations(filteredInspections),
        complianceRate: getComplianceRate(filteredInspections)
      },
      inspections: filteredInspections,
      metrics: overviewData
    };

    // Create downloadable report
    const reportContent = generateReportContent(reportData);
    downloadReport(reportContent, `${selectedReportType}_${selectedSchool}_${selectedInspection}_${new Date().toISOString().split('T')[0]}.txt`);
    
    alert(`✅ ${selectedReportType} generated successfully!\nFiltered by: ${selectedSchool} | ${selectedInspection}\nIncludes ${filteredInspections.length} food inspections with photos and detailed findings.`);
  };

  const calculateAverageRating = (inspections = foodInspectionReports) => {
    const ratings = { 'A+': 4, 'A': 3.5, 'B+': 3, 'B': 2.5, 'C': 2, 'D': 1 };
    const totalScore = inspections.reduce((sum, report) => sum + (ratings[report.rating] || 0), 0);
    return inspections.length > 0 ? (totalScore / inspections.length).toFixed(1) : '0.0';
  };

  const getTotalViolations = (inspections = foodInspectionReports) => {
    return inspections.reduce((total, report) => total + report.violations.length, 0);
  };

  const getComplianceRate = (inspections = foodInspectionReports) => {
    if (inspections.length === 0) return '0.0';
    const compliantReports = inspections.filter(report => report.violations.length === 0).length;
    return ((compliantReports / inspections.length) * 100).toFixed(1);
  };

  const generateReportContent = (data) => {
    return `
FOOD TRANSPARENCY PORTAL - INSPECTION REPORT
============================================
Report Type: ${data.type}
Date Range: ${data.dateRange}
Scheme: ${data.scheme}
Generated: ${data.generatedAt}

EXECUTIVE SUMMARY
================
Total Inspections: ${data.summary.totalInspections}
Average Rating: ${data.summary.averageRating}/4.0
Total Violations: ${data.summary.totalViolations}
Compliance Rate: ${data.summary.complianceRate}%

DETAILED INSPECTION REPORTS
===========================
${data.inspections.map((report, index) => `
${index + 1}. ${report.location}
   Date: ${report.date}
   Inspector: ${report.inspector}
   Rating: ${report.rating}
   
   Key Findings:
   ${report.findings.map(finding => `   • ${finding}`).join('\n')}
   
   Violations:
   ${report.violations.length > 0 ? report.violations.map(violation => `   • ${violation}`).join('\n') : '   • No violations found'}
   
   Photos: ${report.photos.length} inspection photos documented
   ${report.photos.length > 0 ? report.photos.map((photo, idx) => `   - Photo ${idx + 1}: ${photo.name || `inspection_${idx + 1}.jpg`}`).join('\n') : '   - No photos available'}
`).join('\n')}

RECOMMENDATIONS
===============
• Continue monitoring schools with C ratings
• Implement additional training for facilities with violations
• Maintain excellent standards in A+ rated facilities
• Regular follow-up inspections recommended

Report generated by Food Transparency Portal - Social Welfare Department
    `;
  };

  const downloadReport = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportReport = (format) => {
    const selectedReportType = reportTypes.find(r => r.id === reportType)?.name;
    
    let reportData = {
      type: selectedReportType,
      dateRange: dateRange,
      scheme: selectedScheme,
      generatedAt: new Date().toLocaleString(),
      summary: {
        totalInspections: foodInspectionReports.length,
        averageRating: calculateAverageRating(),
        totalViolations: getTotalViolations(),
        complianceRate: getComplianceRate()
      },
      inspections: foodInspectionReports,
      metrics: overviewData
    };

    if (format === 'pdf') {
      generatePDFReport(reportData);
    } else if (format === 'excel') {
      generateExcelReport(reportData);
    } else if (format === 'csv') {
      generateCSVReport(reportData);
    }
  };

  const generatePDFReport = (data) => {
    // Create HTML content for PDF
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Food Transparency Portal - Inspection Report</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
            .subtitle { color: #666; margin-top: 5px; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 18px; font-weight: bold; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
            .summary-item { padding: 15px; background: #f8f9fa; border-radius: 5px; }
            .summary-label { font-weight: bold; color: #666; }
            .summary-value { font-size: 20px; font-weight: bold; color: #2563eb; }
            .inspection { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; page-break-inside: avoid; }
            .inspection-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
            .rating { padding: 5px 15px; border-radius: 20px; font-weight: bold; }
            .rating-a { background: #dcfce7; color: #166534; }
            .rating-b { background: #dbeafe; color: #1e40af; }
            .rating-c { background: #fef3c7; color: #92400e; }
            .findings { margin: 10px 0; }
            .finding-item { margin: 5px 0; padding-left: 20px; }
            .violation { color: #dc2626; }
            .photo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-top: 10px; }
            .photo-item { border: 1px solid #ddd; border-radius: 5px; overflow: hidden; page-break-inside: avoid; }
            .photo-item img { width: 100%; height: 120px; object-fit: cover; display: block; }
            .photo-caption { padding: 8px; background: #f8f9fa; font-size: 12px; color: #666; text-align: center; }
            .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">🏛️ Food Transparency Portal</div>
            <div class="subtitle">Social Welfare Department - Karnataka Government</div>
            <div style="margin-top: 15px;">
                <strong>${data.type}</strong> | ${data.dateRange} | Generated: ${data.generatedAt}
            </div>
        </div>

        <div class="section">
            <div class="section-title">📊 Executive Summary</div>
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-label">Total Inspections</div>
                    <div class="summary-value">${data.summary.totalInspections}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Average Rating</div>
                    <div class="summary-value">${data.summary.averageRating}/4.0</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Total Violations</div>
                    <div class="summary-value">${data.summary.totalViolations}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Compliance Rate</div>
                    <div class="summary-value">${data.summary.complianceRate}%</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">🏫 Detailed Inspection Reports</div>
            ${data.inspections.map((report, index) => `
                <div class="inspection">
                    <div class="inspection-header">
                        <div>
                            <h3>${report.location}</h3>
                            <p>Inspector: ${report.inspector} | Date: ${report.date}</p>
                        </div>
                        <div class="rating rating-${report.rating.toLowerCase().replace('+', '')}">
                            Rating: ${report.rating}
                        </div>
                    </div>
                    
                    <div class="findings">
                        <strong>📋 Key Findings:</strong>
                        ${report.findings.map(finding => `<div class="finding-item">• ${finding}</div>`).join('')}
                    </div>
                    
                    <div class="findings">
                        <strong>⚠️ Violations:</strong>
                        ${report.violations.length > 0 ? 
                            report.violations.map(violation => `<div class="finding-item violation">• ${violation}</div>`).join('') :
                            '<div class="finding-item">• No violations found ✅</div>'
                        }
                    </div>
                    
                    <div style="margin-top: 15px;">
                        <strong>📸 Inspection Photos (${report.photos.length}):</strong>
                        ${report.photos.length > 0 ? `
                            <div class="photo-grid">
                                ${report.photos.map((photo, photoIndex) => `
                                    <div class="photo-item">
                                        <img src="${photo.preview || photo.url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NSA2NUw5NSA3NUwxMTUgNTVMMTM1IDc1VjEwNUg2NVY3NUw4NSA2NVoiIGZpbGw9IiNEMUQ1REIiLz4KPGNpcmNsZSBjeD0iODAiIGN5PSI2MCIgcj0iNSIgZmlsbD0iI0QxRDVEQiIvPgo8L3N2Zz4K'}" 
                                             alt="Inspection Photo ${photoIndex + 1}">
                                        <div class="photo-caption">
                                            Photo ${photoIndex + 1}: ${photo.name || `inspection_${photoIndex + 1}.jpg`}
                                            <br><small>${photo.size ? (photo.size / 1024).toFixed(1) + ' KB' : ''}</small>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : '<div style="color: #666; font-style: italic; margin-top: 5px;">No photos available for this inspection</div>'}
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="section">
            <div class="section-title">💡 Recommendations</div>
            <div class="finding-item">• Continue monitoring schools with C ratings</div>
            <div class="finding-item">• Implement additional training for facilities with violations</div>
            <div class="finding-item">• Maintain excellent standards in A+ rated facilities</div>
            <div class="finding-item">• Schedule regular follow-up inspections as recommended</div>
            <div class="finding-item">• Ensure proper documentation and photo evidence for all inspections</div>
        </div>

        <div class="footer">
            Report generated by Food Transparency Portal - Social Welfare Department<br>
            Karnataka Government | ${new Date().getFullYear()}
        </div>
    </body>
    </html>
    `;

    // Convert HTML to PDF using browser's print functionality
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then trigger print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);

    alert(`✅ PDF report generated successfully!\nUse your browser's print dialog to save as PDF.\nIncludes ${data.summary.totalInspections} food inspections with detailed findings.`);
  };

  const generateExcelReport = (data) => {
    // Create CSV content that can be opened in Excel
    let csvContent = "Food Transparency Portal - Inspection Report\\n\\n";
    csvContent += `Report Type,${data.type}\\n`;
    csvContent += `Date Range,${data.dateRange}\\n`;
    csvContent += `Generated,${data.generatedAt}\\n\\n`;
    
    csvContent += "SUMMARY\\n";
    csvContent += `Total Inspections,${data.summary.totalInspections}\\n`;
    csvContent += `Average Rating,${data.summary.averageRating}/4.0\\n`;
    csvContent += `Total Violations,${data.summary.totalViolations}\\n`;
    csvContent += `Compliance Rate,${data.summary.complianceRate}%\\n\\n`;
    
    csvContent += "DETAILED INSPECTIONS\\n";
    csvContent += "Location,Date,Inspector,Rating,Findings,Violations,Photos\\n";
    
    data.inspections.forEach(report => {
      csvContent += `"${report.location}","${report.date}","${report.inspector}","${report.rating}","${report.findings.join('; ')}","${report.violations.join('; ') || 'None'}","${report.photos.length}"\\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.type}_${data.dateRange}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    alert(`✅ Excel report downloaded successfully!\nFile: ${data.type}_${data.dateRange}_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const generateCSVReport = (data) => {
    let csvContent = "Location,Date,Inspector,Rating,Findings,Violations,Photos,Photo_Names\n";
    
    data.inspections.forEach(report => {
      const findings = report.findings.join('; ');
      const violations = report.violations.join('; ') || 'None';
      const photoNames = report.photos.map(photo => photo.name || 'unnamed').join('; ');
      csvContent += `"${report.location}","${report.date}","${report.inspector}","${report.rating}","${findings}","${violations}","${report.photos.length}","${photoNames}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inspection_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const renderPhotoGallery = () => {
    const filteredInspections = getFilteredInspections();
    
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Inspection Photo Gallery</h2>
            <p className="text-gray-600">View recent inspection photos from schools</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by School</label>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="w-full md:w-64 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {schools.map((school) => (
                  <option key={school} value={school}>
                    {school}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Inspection Type</label>
              <select
                value={selectedInspection}
                onChange={(e) => setSelectedInspection(e.target.value)}
                className="w-full md:w-64 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {inspections.map((inspection) => (
                  <option key={inspection} value={inspection}>
                    {inspection}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredInspections.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No inspection photos found matching the selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInspections.map((inspection) => (
              <div key={inspection.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gray-100">
                  {inspection.photos.length > 0 ? (
                    <img
                      src={inspection.photos[0].url}
                      alt={inspection.photos[0].caption || 'Inspection photo'}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setSelectedPhoto({ ...inspection.photos[0], school: inspection.location, date: inspection.date })}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Image size={48} />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                    {inspection.photos.length} {inspection.photos.length === 1 ? 'photo' : 'photos'}
                  </div>
                  <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded-md shadow-sm">
                    <span className={`font-semibold ${
                      inspection.rating === 'A+' ? 'text-green-600' :
                      inspection.rating === 'B+' ? 'text-blue-600' :
                      'text-yellow-600'
                    }`}>
                      {inspection.rating}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 truncate">{inspection.location}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(inspection.date).toLocaleDateString()} • {inspection.inspector}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {inspection.findings.slice(0, 2).map((finding, idx) => (
                      <span key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {finding.split(':')[0]}
                      </span>
                    ))}
                    {inspection.findings.length > 2 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        +{inspection.findings.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const PhotoModal = ({ photo, onClose, onNext, onPrev, hasNext, hasPrev }) => {
    if (!photo) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
          aria-label="Close"
        >
          <X size={32} />
        </button>
        
        {hasPrev && (
          <button
            onClick={onPrev}
            className="absolute left-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            aria-label="Previous photo"
          >
            <ChevronLeft size={32} />
          </button>
        )}
        
        <div className="relative max-w-4xl w-full">
          <img
            src={photo.url}
            alt={photo.caption || 'Inspection photo'}
            className="max-h-[80vh] w-auto mx-auto object-contain"
          />
          <div className="mt-4 text-white text-center">
            <h3 className="text-xl font-semibold mb-1">{photo.school}</h3>
            <p className="text-gray-300">{photo.caption}</p>
            <p className="text-sm text-gray-400 mt-2">{new Date(photo.date).toLocaleDateString()}</p>
          </div>
        </div>
        
        {hasNext && (
          <button
            onClick={onNext}
            className="absolute right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            aria-label="Next photo"
          >
            <ChevronRight size={32} />
          </button>
        )}
      </div>
    );
  };

  const overviewData = {
    totalBeneficiaries: 12847,
    totalSchemes: 24,
    totalBudget: 25000000,
    utilizedBudget: 21500000,
    completedAudits: 156,
    pendingAudits: 23
  };

  const schemePerformance = [
    { name: 'Pre-Matric Scholarship', beneficiaries: 4250, budget: 5000000, utilization: 84, completion: 78 },
    { name: 'Post-Matric Scholarship', beneficiaries: 3200, budget: 8000000, utilization: 89, completion: 89 },
    { name: 'Skill Development', beneficiaries: 1800, budget: 3500000, utilization: 80, completion: 92 },
    { name: 'Self Employment', beneficiaries: 950, budget: 6000000, utilization: 75, completion: 86 }
  ];

  const monthlyTrends = [
    { month: 'Jan', beneficiaries: 1200, budget: 2100000, audits: 12 },
    { month: 'Feb', beneficiaries: 1350, budget: 2300000, audits: 15 },
    { month: 'Mar', beneficiaries: 1180, budget: 2000000, audits: 11 },
    { month: 'Apr', beneficiaries: 1420, budget: 2500000, audits: 18 },
    { month: 'May', beneficiaries: 1380, budget: 2400000, audits: 16 },
    { month: 'Jun', beneficiaries: 1500, budget: 2600000, audits: 20 }
  ];

  const auditFindings = [
    { type: 'Compliance Issues', count: 8, severity: 'medium' },
    { type: 'Documentation Gaps', count: 15, severity: 'low' },
    { type: 'Financial Irregularities', count: 3, severity: 'high' },
    { type: 'Process Improvements', count: 22, severity: 'low' }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Generate comprehensive reports and analyze scheme performance</p>
      </div>

      {/* Report type tabs */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setReportType(type.id)}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                reportType === type.id
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <type.icon className="w-5 h-5 mr-2" />
              {type.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {reportType === 'overview' && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Category Distribution</h3>
              <div className="space-y-4">
                {categoryDistribution.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{category.category}</span>
                      <span className="text-sm font-medium text-gray-900">{category.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Inspections */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Inspections</h3>
              <div className="space-y-4">
                {foodInspectionReports.map((report) => (
                  <div key={report.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">{report.location}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        report.rating === 'A+' ? 'bg-green-100 text-green-800' :
                        report.rating === 'B+' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.rating}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(report.date).toLocaleDateString()} • {report.inspector}
                    </p>
                    {report.photos.length > 0 && (
                      <div className="mt-2 flex space-x-2 overflow-x-auto pb-2">
                        {report.photos.slice(0, 3).map((photo, idx) => (
                          <div key={idx} className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded overflow-hidden">
                            <img 
                              src={photo.url} 
                              alt={photo.caption} 
                              className="w-full h-full object-cover"
                              onClick={() => setSelectedPhoto({ ...photo, school: report.location, date: report.date })}
                            />
                          </div>
                        ))}
                        {report.photos.length > 3 && (
                          <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm">
                            +{report.photos.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {reportType === 'gallery' && renderPhotoGallery()}

        {reportType === 'financial' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Financial Reports</h3>
            <p className="text-gray-600">Financial reports will be displayed here.</p>
          </div>
        )}

        {reportType === 'beneficiary' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Beneficiary Reports</h3>
            <p className="text-gray-600">Beneficiary reports will be displayed here.</p>
          </div>
        )}

        {reportType === 'audit' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Audit Reports</h3>
            <p className="text-gray-600">Audit reports will be displayed here.</p>
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onNext={() => {
            // Find the next photo in the current inspection
            const currentInspection = foodInspectionReports.find(
              (inspection) => inspection.location === selectedPhoto.school
            );
            if (currentInspection) {
              const currentIndex = currentInspection.photos.findIndex(
                (p) => p.caption === selectedPhoto.caption
              );
              if (currentIndex < currentInspection.photos.length - 1) {
                setSelectedPhoto({
                  ...currentInspection.photos[currentIndex + 1],
                  school: currentInspection.location,
                  date: currentInspection.date
                });
              }
            }
          }}
          onPrev={() => {
            // Find the previous photo in the current inspection
            const currentInspection = foodInspectionReports.find(
              (inspection) => inspection.location === selectedPhoto.school
            );
            if (currentInspection) {
              const currentIndex = currentInspection.photos.findIndex(
                (p) => p.caption === selectedPhoto.caption
              );
              if (currentIndex > 0) {
                setSelectedPhoto({
                  ...currentInspection.photos[currentIndex - 1],
                  school: currentInspection.location,
                  date: currentInspection.date
                });
              }
            }
          }}
          hasNext={true}
          hasPrev={true}
        />
      )}
    </div>
  );
};

export default Reports;
