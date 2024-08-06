"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VideoCard = ({ video }) => {
  return (
    <Card className="col-span-1">
      <div className="w-full h-60">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <CardHeader>
        <CardTitle>{video.title}</CardTitle>
        <Button variant="link" className="max-w-fit p-0">
          @ {video.channel}
        </Button>
      </CardHeader>
      <CardContent>
        <p>{video.description}</p>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
