              className="hidden"
            />
            <Button 
              onClick={handleFileButtonClick}
              variant="outline"
              className="w-full"
            >
              Choose JSON File
            </Button>
          </div>
          <p className="text-sm text-gray-500">Supports .json export files from Delilah Assessment System</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default LoadTestData;