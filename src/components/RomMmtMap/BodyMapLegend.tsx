import React from 'react';

export const BodyMapLegend = () => (
  <div className="w-full max-w-md">
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <h4 className="text-sm font-medium mb-2">ROM Scores</h4>
        <div className="grid grid-cols-5 gap-2 text-xs text-center">
          <div>WFL</div>
          <div>3/4</div>
          <div>1/2</div>
          <div>1/4</div>
          <div>Nominal</div>
          <div className="w-4 h-4 mx-auto rounded-full bg-green-200 border border-green-600"></div>
          <div className="w-4 h-4 mx-auto rounded-full bg-blue-200 border border-blue-600"></div>
          <div className="w-4 h-4 mx-auto rounded-full bg-yellow-200 border border-yellow-600"></div>
          <div className="w-4 h-4 mx-auto rounded-full bg-orange-200 border border-orange-600"></div>
          <div className="w-4 h-4 mx-auto rounded-full bg-red-200 border border-red-600"></div>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">MMT Grades</h4>
        <div className="grid grid-cols-5 gap-2 text-xs text-center">
          <div>5/5</div>
          <div>4/5</div>
          <div>3/5</div>
          <div>2/5</div>
          <div>1/5</div>
          <div className="w-4 h-4 mx-auto bg-green-200"></div>
          <div className="w-4 h-4 mx-auto bg-blue-200"></div>
          <div className="w-4 h-4 mx-auto bg-yellow-200"></div>
          <div className="w-4 h-4 mx-auto bg-orange-200"></div>
          <div className="w-4 h-4 mx-auto bg-red-200"></div>
        </div>
      </div>
    </div>
  </div>
);