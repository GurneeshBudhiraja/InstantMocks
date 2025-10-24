"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontalIcon,
  CopyIcon,
  TrashIcon,
  ExternalLinkIcon,
  ClockIcon,
} from "lucide-react";
import { useState } from "react";
import { MockAPI } from "./types";

interface MockApiCardProps {
  mockApi: MockAPI;
  onDelete: (id: string) => void;
  onCopy: (endpoint: string) => void;
}

export function MockApiCard({ mockApi, onDelete, onCopy }: MockApiCardProps) {
  const [showActions, setShowActions] = useState(false);

  const formatExpiryTime = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();

    if (diffMs <= 0) {
      return { text: "Expired", isExpired: true };
    }

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours > 0) {
      return {
        text: `Expires in ${diffHours}h ${diffMinutes % 60}m`,
        isExpired: false,
      };
    } else {
      return { text: `Expires in ${diffMinutes}m`, isExpired: false };
    }
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "POST":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "PUT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "DELETE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300)
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (status >= 400 && status < 500)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    if (status >= 500)
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  return (
    <Card className="group hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground mb-2">
              {mockApi.name}
            </CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getMethodColor(mockApi.method)}>
                {mockApi.method}
              </Badge>
              <Badge className={getStatusColor(mockApi.status)}>
                {mockApi.status}
              </Badge>
            </div>
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActions(!showActions)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontalIcon className="w-4 h-4" />
            </Button>
            {showActions && (
              <div className="absolute right-0 top-8 bg-background border border-border rounded-md shadow-lg z-10 min-w-[120px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onCopy(mockApi.fullApiUrl || mockApi.endpoint)}
                >
                  <CopyIcon className="w-4 h-4 mr-2" />
                  Copy URL
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => onDelete(mockApi.id)}
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              API Endpoint
            </p>
            <div className="flex items-center gap-2">
              <code className="text-sm bg-muted px-2 py-1 rounded font-mono flex-1 break-all">
                {mockApi.fullApiUrl || mockApi.endpoint}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopy(mockApi.fullApiUrl || mockApi.endpoint)}
                className="shrink-0"
              >
                <CopyIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Description
            </p>
            <p className="text-sm text-muted-foreground">
              {mockApi.description}
            </p>
          </div>

          {/* Expiry Time */}
          {mockApi.expiresAt && (
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Expiry</p>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-muted-foreground" />
                <span
                  className={`text-sm ${
                    formatExpiryTime(mockApi.expiresAt).isExpired
                      ? "text-red-600 font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {formatExpiryTime(mockApi.expiresAt).text}
                </span>
              </div>
            </div>
          )}

          {/* Query Parameters */}
          {mockApi.queryParams && mockApi.queryParams.length > 0 && (
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Query Parameters
              </p>
              <div className="flex flex-wrap gap-1">
                {mockApi.queryParams.slice(0, 3).map((param, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {param.key}={param.value}
                  </Badge>
                ))}
                {mockApi.queryParams.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{mockApi.queryParams.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Request Body */}
          {mockApi.requestBody &&
            Object.keys(mockApi.requestBody).length > 0 && (
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Request Body
                </p>
                <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded font-mono">
                  {Object.keys(mockApi.requestBody).length} field(s)
                </div>
              </div>
            )}

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Created {new Date(mockApi.createdAt).toLocaleDateString()}
            </span>
            <Button variant="outline" size="sm" className="text-xs">
              <ExternalLinkIcon className="w-3 h-3 mr-1" />
              Test
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
